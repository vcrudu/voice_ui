import Speaker from '../polly/speaker';
import _ from 'underscore';

(function () {
  'use strict';
  var AudioControl = require('./control.js');
  var DEFAULT_LATEST = 'production';
  var DEFAULT_CONTENT_TYPE = 'audio/x-l16; sample-rate=16000; channel-count=1';
  var DEFAULT_USER_ID = 'userId';
  var DEFAULT_ACCEPT_HEADER_VALUE = 'text/plain; charset=utf-8';//'audio/mpeg';
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
      console.log('voice state:' + state.message);
      // If we are transitioning in to sending and we are not detecting silence (this was a manual state change)
      // we need to do some cleanup: stop recording, and stop rendering.
      if (state.message === state.messages.SENDING && !this.config.silenceDetection) {
        audioControl.stopRecording();
      }
      if (state.message === state.messages.PASSIVE) {
        audioControl.clear();
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
      var reader = new FileReader();
      reader.readAsDataURL(state.audioInput);
      reader.onloadend = function () {
        if (!reader.result) return;
        let audioBytes = reader.result.replace('data:application/octet-stream;base64,', '');
        console.log(audioBytes);
        const audio = {
          content: audioBytes,
        };
        const config = {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
        };
        const request = {
          audio: audio,
          config: config,
        };

        $.ajax({
          url: "https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyBW4mfOF5OcTi-eIuw2UfxNxHt8mk1LGcE",
          type: 'POST',
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify(request)
        }).done(function (response) {
          if (!response) {
            state.onError(err);
            state.transition(new Initial(state));
          } else {
            let results = response.results;
            if (results && results.length && results.length > 0
              && results[0].alternatives
              && results[0].alternatives.length> 0) {
              var bestTranscription = _.reduce(results[0].alternatives,
                (current, alt) => alt.confidence > current.confidence ? alt : current,
                results[0].alternatives[0]);
                state.audioOutput = bestTranscription;
                //state.transition(new Speaking(state));
                state.transition(new Initial(state));
                state.onSuccess(bestTranscription);
                console.log(bestTranscription);
            
          } else {
            state.transition(new Initial(state));
          }
        }}).fail(function (err) {
          state.onError(err);
          state.transition(new Initial(state));
        });
      }
    };
  };

  var Speaking = function (state) {
    this.state = state;
    state.message = state.messages.SPEAKING;
    this.advanceConversation = function () {
            state.transition(new Initial(state));
    };
  };

  var applyDefaults = function (config) {
    config = config || {};
    config.silenceDetection = config.hasOwnProperty('silenceDetection') ? config.silenceDetection : true;

    var lexConfig = config.lexConfig || {};
    lexConfig.botAlias = lexConfig.hasOwnProperty('botAlias') ? lexConfig.botAlias : DEFAULT_LATEST;
    lexConfig.contentType = lexConfig.hasOwnProperty('contentType') ? lexConfig.contentType : DEFAULT_CONTENT_TYPE;
    lexConfig.userId = lexConfig.hasOwnProperty('userId') ? lexConfig.userId : DEFAULT_USER_ID;
    lexConfig.accept = lexConfig.hasOwnProperty('accept') ? lexConfig.accept : DEFAULT_ACCEPT_HEADER_VALUE;
    config.lexConfig = lexConfig;

    return config;
  };

})();