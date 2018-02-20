(function () {
  'use strict';
  var worker = new Worker('js/audio.bundle.js');
  var audio_context;
  var moment = require('moment');
  var gain_node;

  /**
   * The Recorder object. Sets up the onaudioprocess callback and communicates
   * with the web worker to perform audio actions.
   */
  var recorder = function (silenceDetectionConfig) {

    silenceDetectionConfig = silenceDetectionConfig || {};
    silenceDetectionConfig.time = silenceDetectionConfig.hasOwnProperty('time') ? silenceDetectionConfig.time : 1500;
    silenceDetectionConfig.amplitude = silenceDetectionConfig.hasOwnProperty('amplitude') ? silenceDetectionConfig.amplitude : 0.2;

    var recording = false,
      currCallback, start, silenceCallback, visualizationCallback, analyserBuffer, analyserBufferSource, analyser;


    // Create a ScriptProcessorNode with a bufferSize of 4096 and a single input and output channel
    // var node = source.context.createScriptProcessor(4096, 1, 1);

    worker.onmessage = function (message) {
      if(message.data.silence){
        console.log("Silence called");
        silenceCallback();
        return;
      }
      var blob = message.data;
      currCallback(blob);
    };

    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: audioinput.SAMPLERATE.VOIP_16000Hz
      }
    });

    /**
     * Sets the silence and viz callbacks, resets the silence start time, and sets recording to true.
     * @param {?onSilenceCallback} onSilence - Called when silence is detected.
     * @param {?visualizerCallback} visualizer - Can be used to visualize the captured buffer.
     */
    var record = function (onSilence, visualizer) {
      silenceCallback = onSilence;
      visualizationCallback = visualizer;
      start = Date.now();
      recording = true;
    };

    /**
     * Sets recording to false.
     */
    var stop = function () {
      recording = false;
      audioinput.stop();
    };

    /**
     * Posts "clear" message to the worker.
     */
    var clear = function () {
      stop();
      worker.postMessage({ command: 'clear' });
    };

    /**
     * Sets the export callback and posts an "export" message to the worker.
     * @param {onExportComplete} callback - Called when the export is complete.
     * @param {sampleRate} The sample rate to use in the export.
     */
    var exportWAV = function (callback, sampleRate) {
      currCallback = callback;
      worker.postMessage({
        command: 'export',
        sampleRate: sampleRate
      });
    };

    /**
     * Checks the time domain data to see if the amplitude of the audio waveform is more than
     * the silence threshold. If it is, "noise" has been detected and it resets the start time.
     * If the elapsed time reaches the time threshold the silence callback is called. If there is a 
     * visualizationCallback it invokes the visualization callback with the time domain data.
     */
    var analyse = function (data) {
      
      //console.log(data);
      /*analyserBuffer = webAudioContext.createBuffer(1, data.length, audioinput.getCfg().sampleRate);    
      for (var i = 0; i < data.length; i++) {
        analyserBuffer[i] = data[i];
      }
      analyserBufferSource = webAudioContext.createBufferSource();
      analyserBufferSource.buffer = analyserBuffer;      
      analyserBufferSource.connect(analyser);
      analyserBufferSource.start();

      analyser.fftSize = 2048;
      var bufferLength = analyser.fftSize;
      var dataArray = new Uint8Array(bufferLength);
      var amplitude = silenceDetectionConfig.amplitude;
      var time = silenceDetectionConfig.time;
      
      analyser.getByteTimeDomainData(dataArray);
      console.log(dataArray);*/
      if (typeof visualizationCallback === 'function') {
        visualizationCallback(data, data.length);
      }
      
      /* if(moment(start).add(5, 'seconds').isBefore(moment())){
        silenceCallback();
      } */
    };

    function onAudioInputCapture(evt) {
      try {
        if (evt && evt.data) {
          if (!recording) {
            return;
          }

          worker.postMessage({
            command: 'record',
            buffer: [
              evt.data
            ]
          });
            analyse(evt.data);
        }
        else {
          console.log("Unknown audioinput event!");
        }
      }
      catch (ex) {
        console.log("onAudioInputCapture ex: " + ex);
      }
    }

    function onAudioInputError(error) {
      console.log("onAudioInputError event recieved: " + JSON.stringify(error));
    }

    window.addEventListener("audioinput", onAudioInputCapture, false);
    window.addEventListener("audioinputerror", onAudioInputError, false);

    audioinput.start({
      sampleRate: audioinput.SAMPLERATE.VOIP_16000Hz,
      format:audioinput.FORMAT.PCM_16BIT,
      audioSourceType: audioinput.AUDIOSOURCE_TYPE.DEFAULT,
      normalize: true,
      normalizationFactor: 13106.8,
      bufferSize: 4096,
      channels: audioinput.CHANNELS.MONO,
      streamToWebAudio: false,
      concatenateMaxChunks: 10
    });

    return {
      record: record,
      stop: stop,
      clear: clear,
      exportWAV: exportWAV
    };
  };

  /**
   * Audio recorder object. Handles setting up the audio context,
   * accessing the mike, and creating the Recorder object.
   */
  module.exports = function () {

    /**
     * Creates an audio context and calls getUserMedia to request the mic (audio).
     */
    var requestDevice = function () {
      if (typeof audio_context === 'undefined') {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audio_context = new AudioContext();
        gain_node = audio_context.createGain();
      }
    };

    var createRecorder = function (silenceDetectionConfig) {
      return recorder(silenceDetectionConfig);
    };

    var audioContext = function () {
      return audio_context;
    };

    var gainNode = function () {
      return gain_node;
    };

    return {
      requestDevice: requestDevice,
      createRecorder: createRecorder,
      audioContext: audioContext,
      gainNode: gainNode
    };

  };
})();