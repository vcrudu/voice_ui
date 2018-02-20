(function () {
    'use strict';
    var audioRecorderFactory = require('./recorder.js');
    var fileSystemFactory = require('./fileSystem.js');
    var recorder, audioRecorder, checkAudioSupport, audioSupported, playbackSource, fileSystem, UNSUPPORTED = 'Audio is not supported.';
  
    /**
     * Represents an audio control that can start and stop recording,
     * export captured audio, play an audio buffer, and check if audio
     * is supported.
     */
    module.exports = function (options) {
      options = options || {};
      this.checkAudioSupport = options.checkAudioSupport !== false;
      fileSystem = fileSystemFactory();
      fileSystem.requestTemporaryFileSystem();
      /**
       * This callback type is called `onSilenceCallback`.
       *
       * @callback onSilenceCallback
       */
  
      /**
       * Visualize callback: `visualizerCallback`.
       *
       * @callback visualizerCallback
       * @param {Uint8Array} dataArray
       * @param {number} bufferLength
       */
  
      /**
       * Clears the previous buffer and starts buffering audio.
       *
       * @param {?onSilenceCallback} onSilence - Called when silence is detected.
       * @param {?visualizerCallback} visualizer - Can be used to visualize the captured buffer.
       * @param {silenceDetectionConfig} - Specify custom silence detection values.
       * @throws {Error} If audio is not supported.
       */
      var startRecording = function (onSilence, visualizer, silenceDetectionConfig) {
        onSilence = onSilence || function () { /* no op */
          };
        visualizer = visualizer || function () { /* no op */
          };
        audioSupported = audioSupported !== false;
        if (!audioSupported) {
          throw new Error(UNSUPPORTED);
        }
        recorder = audioRecorder.createRecorder(silenceDetectionConfig);
        recorder.record(onSilence, visualizer);
      };
  
      /**
       * Stops buffering audio.
       *
       * @throws {Error} If audio is not supported.
       */
      var stopRecording = function () {
        audioSupported = audioSupported !== false;
        if (!audioSupported) {
          throw new Error(UNSUPPORTED);
        }
        recorder.stop();
      };
  
      /**
       * On export complete callback: `onExportComplete`.
       *
       * @callback onExportComplete
       * @param {Blob} blob The exported audio as a Blob.
       */
  
      /**
       * Exports the captured audio buffer.
       *
       * @param {onExportComplete} callback - Called when the export is complete.
       * @param {sampleRate} The sample rate to use in the export.
       * @throws {Error} If audio is not supported.
       */
      var exportWAV = function (callback, sampleRate) {
        audioSupported = audioSupported !== false;
        if (!audioSupported) {
          throw new Error(UNSUPPORTED);
        }
        if (!(callback && typeof callback === 'function')) {
          throw new Error('You must pass a callback function to export.');
        }
        sampleRate = (typeof sampleRate !== 'undefined') ? sampleRate : 16000;
        recorder.exportWAV(callback, sampleRate);
      };
  
      /**
       * On playback complete callback: `onPlaybackComplete`.
       *
       * @callback onPlaybackComplete
       */
  
      /**
       * Plays the audio buffer with an HTML5 audio tag.
       * @param {Uint8Array} buffer - The audio buffer to play.
       * @param {?onPlaybackComplete} callback - Called when audio playback is complete.
       */
      var playHtmlAudioElement = function (buffer, callback) {
        if (typeof buffer === 'undefined') {
          return;
        }
        var myBlob = new Blob([buffer]);
        var audio = document.createElement('audio');
        var objectUrl = window.URL.createObjectURL(myBlob);
        audio.src = objectUrl;
        audio.addEventListener('ended', function () {
          audio.currentTime = 0;
          if (typeof callback === 'function') {
            callback();
          }
        });
        audio.play();
        recorder.clear();
      };

      var playNative = function (url, callback) {
        /* if( window.plugins && window.plugins.NativeAudio ) {
	
          window.plugins.NativeAudio.preloadSimple( 'answer', url, function(msg){
          }, function(msg){
            console.log( 'error: ' + msg );
          });
        
          // Play
          window.plugins.NativeAudio.play( 'answer' );
        } else {
          console.log("No native audio plugin");
        } */
        // Play the audio file at url
          url = url.replace('file://', '');
      
        var my_media = new Media(url,
          // success callback
          function () { console.log("playAudio():Audio Success"); recorder.clear(); callback();},
          // error callback
          function (err) { console.log("playAudio():Audio Error: " + JSON.stringify(err)); }
        );

        // Play audio
        my_media.play();
      }
  
      /**
       * On playback complete callback: `onPlaybackComplete`.
       *
       * @callback onPlaybackComplete
       */
  
      /**
       * Plays the audio buffer with a WebAudio AudioBufferSourceNode. 
       * @param {Uint8Array} buffer - The audio buffer to play.
       * @param {?onPlaybackComplete} callback - Called when audio playback is complete.
       */
      var play = function (buffer, callback) {
        if (typeof buffer === 'undefined') {
          return;
        }
        var myBlob = new Blob([buffer]);
        fileSystem.writeToTemporaryFile(myBlob, function(err, answerUrl){
          console.log("Answer url: "+ answerUrl);
          playNative(answerUrl, callback);
        });
        
        // We'll use a FileReader to create and ArrayBuffer out of the audio response.
        /* var fileReader = new FileReader();
        fileReader.onload = function() {
          // Once we have an ArrayBuffer we can create our BufferSource and decode the result as an AudioBuffer.
          playbackSource = audioRecorder.audioContext().createBufferSource();
          audioRecorder.audioContext().decodeAudioData(this.result, function(buf) {
            // Set the source buffer as our new AudioBuffer.
            playbackSource.buffer = buf;
            
            playbackSource.connect(audioRecorder.gainNode());
            console.log({maxValue: audioRecorder.gainNode().gain.maxValue});
            console.log({value: audioRecorder.gainNode().gain.value});
            // Set the destination (the actual audio-rendering device--your device's speakers).
            audioRecorder.gainNode().connect(audioRecorder.audioContext().destination);
            // Add an "on ended" callback.
            playbackSource.onended = function(event) {
              if (typeof callback === 'function') {
                callback();
              }
            };
            // Start the playback.
            playbackSource.start(0);
          });
          recorder.clear();
        };
        fileReader.readAsArrayBuffer(myBlob); */
      };
  
      /**
       * Stops the playback source (created by the play method) if it exists. The `onPlaybackComplete`
       * callback will be called.
       */
      var stop = function() {
        if (typeof playbackSource === 'undefined') {
          return;
        }
        playbackSource.stop();
      };
  
      /**
       * Clear the recording buffer.
       */
      var clear = function () {
        recorder.clear();
      };
  
      /**
       * On audio supported callback: `onAudioSupported`.
       *
       * @callback onAudioSupported
       * @param {boolean}
       */
  
      /**
       * Checks that getUserMedia is supported and the user has given us access to the mic.
       * @param {onAudioSupported} callback - Called with the result.
       */
      var supportsAudio = function (callback) {
        callback = callback || function () { /* no op */ };
        audioSupported = !!window.audioinput;
        if(audioSupported){
          audioRecorder = audioRecorderFactory();
          audioRecorder.requestDevice();
        }
        callback(audioSupported);
      };
  
      if (this.checkAudioSupport) {
        supportsAudio();
      }
  
      return {
        startRecording: startRecording,
        stopRecording: stopRecording,
        exportWAV: exportWAV,
        play: play,
        stop: stop,
        clear: clear,
        playHtmlAudioElement: playHtmlAudioElement,
        supportsAudio: supportsAudio
      };
    };
  })();