import Speaker from '../polly/speaker';

(function () {
  'use strict';
  var AudioControl = require('./control.js');
  var DEFAULT_LATEST = 'production';
  var DEFAULT_CONTENT_TYPE = 'audio/x-l16; sample-rate=16000; channel-count=1';
  var DEFAULT_USER_ID = 'userId';
  var DEFAULT_ACCEPT_HEADER_VALUE = 'audio/mpeg';
  var MESSAGES = Object.freeze({
    PASSIVE: 'Passive',
    LISTENING: 'Listening',
    SENDING: 'Sending',
    SPEAKING: 'Speaking'
  });

  var lexruntime, audioControl = new AudioControl({ checkAudioSupport: false });

  module.exports = function (config, onStateChange, onSuccess, onError, onAudioData) {
    var currentState;

    // Apply default values.
    this.config = applyDefaults(config);
    this.lexConfig = this.config.lexConfig;
    this.messages = MESSAGES;
    onStateChange = onStateChange || function () { /* no op */ };
    this.onSuccess = onSuccess || function () { /* no op */ };
    this.onError = onError || function () { /* no op */ };
    this.onAudioData = onAudioData || function () { /* no op */ };

    // Validate input.
    if (!this.config.lexConfig.botName) {
      this.onError('A Bot name must be provided.');
      return;
    }
    if (!AWS.config.credentials) {
      this.onError('AWS Credentials must be provided.');
      return;
    }
    if (!AWS.config.region) {
      this.onError('A Region value must be provided.');
      return;
    }

    lexruntime = new AWS.LexRuntime();

    this.onSilence = function () {
      if (config.silenceDetection) {
        audioControl.stopRecording();
        currentState.advanceConversation();
      }
    };

    this.transition = function (conversation) {
      currentState = conversation;
      var state = currentState.state;
      onStateChange(state.message);

      // If we are transitioning into SENDING or SPEAKING we want to immediately advance the conversation state
      // to start the service call or playback.
      if (state.message === state.messages.SENDING || state.message === state.messages.SPEAKING) {
        currentState.advanceConversation();
      }
      // If we are transitioning in to sending and we are not detecting silence (this was a manual state change)
      // we need to do some cleanup: stop recording, and stop rendering.
      if (state.message === state.messages.SENDING && !this.config.silenceDetection) {
        audioControl.stopRecording();
      }
    };

    this.advanceConversation = function () {
      audioControl.supportsAudio(function (supported) {
        if (supported) {
          currentState.advanceConversation();
        } else {
          onError('Audio is not supported.');
        }
      });
    };

    this.updateConfig = function (newValue) {
      this.config = applyDefaults(newValue);
      this.lexConfig = this.config.lexConfig;
    };

    this.reset = function () {
      audioControl.clear();
      currentState = new Initial(currentState.state);
    };

    this.sendAnswer = function (answer) {
      currentState = new Sending(currentState.state);
      currentState.advanceConversation(answer);
    };

    currentState = new Initial(this);

    return {
      advanceConversation: this.advanceConversation,
      updateConfig: this.updateConfig,
      reset: this.reset,
      sendAnswer: this.sendAnswer
    };
  };

  var Initial = function (state) {
    this.state = state;
    state.message = state.messages.PASSIVE;
    this.advanceConversation = function () {
      audioControl.startRecording(state.onSilence, state.onAudioData, state.config.silenceDetectionConfig);
      state.transition(new Listening(state));
    };
  };

  var Listening = function (state) {
    this.state = state;
    state.message = state.messages.LISTENING;
    this.advanceConversation = function () {
      audioControl.exportWAV(function (blob) {
        state.audioInput = blob;
        state.transition(new Sending(state));
      });
    };
  };

  var Sending = function (state) {
    this.state = state;
    state.message = state.messages.SENDING;
    this.advanceConversation = function (answer) {
      if (!answer) {
        state.lexConfig.inputStream = state.audioInput;
        if(state.audioOutput && state.audioOutput.dialogState){
          var requestAttributes = {dialogState:state.audioOutput.dialogState};          
          if(state.audioOutput && state.audioOutput.slotToElicit){
            requestAttributes.slotToElicit = state.audioOutput.slotToElicit;
            state.lexConfig.requestAttributes = {"x-amz-lex-request-attributes":btoa(JSON.stringify(requestAttributes))};
          }
        }
        
        lexruntime.postContent(state.lexConfig, function (err, data) {
          if (err) {
            state.onError(err);
            state.transition(new Initial(state));
          } else {
            state.audioOutput = data;
            state.transition(new Speaking(state));
            state.onSuccess(data);
          }
        });
      } else {
        let postTextConfig = {
          botAlias: state.lexConfig.botAlias,
          botName: state.lexConfig.botName,
          inputText: answer,
          userId: state.lexConfig.userId
        }
        lexruntime.postText(postTextConfig, function (err, data) {
          if (err) {
            state.onError(err);
            state.transition(new Initial(state));
          } else {
            if (data.audioStream) {
              state.audioOutput = data;
              state.transition(new Speaking(state));
              state.onSuccess(data);
            } else {
              const speaker = new Speaker();
              speaker.speak(data.message);
              state.transition(new Initial(state));
            }
          }
        });
      }
    };
  };

  var Speaking = function (state) {
    this.state = state;
    state.message = state.messages.SPEAKING;
    this.advanceConversation = function () {
      if (state.audioOutput.contentType === 'audio/mpeg') {
        audioControl.play(state.audioOutput.audioStream, function () {
          if (state.audioOutput.dialogState === 'ReadyForFulfillment' ||
            state.audioOutput.dialogState === 'Fulfilled' ||
            state.audioOutput.dialogState === 'Failed' ||
            !state.config.silenceDetection) {
            state.transition(new Initial(state));
          } else {
            //audioControl.startRecording(state.onSilence, state.onAudioData, state.config.silenceDetectionConfig);
            state.transition(new Initial(state));//state.transition(new Listening(state));
          }
        });
      } else {
        state.transition(new Initial(state));
      }
    };
  };

  var applyDefaults = function (config) {
    config = config || {};
    config.silenceDetection = config.hasOwnProperty('silenceDetection') ? config.silenceDetection : true;

    var lexConfig = config.lexConfig || {};
    lexConfig.botAlias = lexConfig.hasOwnProperty('botAlias') ? lexConfig.botAlias : DEFAULT_LATEST;
    lexConfig.botName = lexConfig.hasOwnProperty('botName') ? lexConfig.botName : '';
    lexConfig.contentType = lexConfig.hasOwnProperty('contentType') ? lexConfig.contentType : DEFAULT_CONTENT_TYPE;
    lexConfig.userId = lexConfig.hasOwnProperty('userId') ? lexConfig.userId : DEFAULT_USER_ID;
    lexConfig.accept = lexConfig.hasOwnProperty('accept') ? lexConfig.accept : DEFAULT_ACCEPT_HEADER_VALUE;
    config.lexConfig = lexConfig;

    return config;
  };

})();