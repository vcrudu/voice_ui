'use strict';
var recLength = 0,
  recBuffer = [],
  max = 0,
  start,
  startMeasureSilence,
  silenceLevel = 0.05,
  measureSilenceInterval = 500,
  recordSampleRate;

onmessage = function (e) {
  switch (e.data.command) {
    case 'init':
      init(e.data.config);
      break;
    case 'record':
      record(e.data.buffer);
      break;
    case 'export':
      exportBuffer(e.data.sampleRate);
      break;
    case 'clear':
      clear();
      break;
  }
};

function init(config) {
  recordSampleRate = config.sampleRate;
}

function record(inputBuffer) {
  if (recBuffer.length == 0) {
    startMeasureSilence = Date.now();
  }

  recBuffer.push(inputBuffer[0]);
  recLength += inputBuffer[0].length;
  for (var i = 0; i < inputBuffer[0].length; i++) {
    var curr_value_time = inputBuffer[0][i];
    //console.log(curr_value_time);
    var newtime = Date.now();
    /*if(newtime - startMeasureSilence<measureSilenceInterval){
      if(Math.abs(curr_value_time)>silenceLevel){
        silenceLevel = Math.abs(curr_value_time);
      }
    } */

    //if(newtime - startMeasureSilence>measureSilenceInterval){
      if (Math.abs(curr_value_time) > silenceLevel) {
        start = Date.now();
      }
    //}
  }
  if (start) {
    newtime = Date.now();
    var elapsedTime = newtime - start;
    console.log("elapsedTime: " + elapsedTime);
    
    if (elapsedTime > 1000) {
      postMessage({ silence: true });
    }
  }
}

function exportBuffer(exportSampleRate) {
  var mergedBuffers = mergeBuffers(recBuffer, recLength);
  var downsampledBuffer = downsampleBuffer(mergedBuffers, exportSampleRate);
  var encodedWav = encodeWAV(downsampledBuffer);
  var audioBlob = new Blob([encodedWav], { type: 'application/octet-stream' });
  postMessage(audioBlob);
}

function clear() {
  recLength = 0;
  recBuffer = [];
  start = null;
  startMeasureSilence = null;
  silenceLevel = 0.05;
}

function downsampleBuffer(buffer, exportSampleRate) {
  if (exportSampleRate === recordSampleRate) {
    return buffer;
  }
  var sampleRateRatio = recordSampleRate / exportSampleRate;
  var newLength = Math.round(buffer.length / sampleRateRatio);
  var result = new Float32Array(newLength);
  var offsetResult = 0;
  var offsetBuffer = 0;
  while (offsetResult < result.length) {
    var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    var accum = 0,
      count = 0;
    for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = accum / count;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

function mergeBuffers(bufferArray, recLength) {
  var result = new Float32Array(recLength);
  var offset = 0;
  for (var i = 0; i < bufferArray.length; i++) {
    result.set(bufferArray[i], offset);
    offset += bufferArray[i].length;
  }

  max = result.reduce(function (max, value) {
    return max > Math.abs(value) ? max : Math.abs(value);
  }, max);
  console.log(max);
  return result;
}

function floatTo16BitPCM(output, offset, input) {
  for (var i = 0; i < input.length; i++ , offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

function writeString(view, offset, string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function encodeWAV(samples) {
  var buffer = new ArrayBuffer(44 + samples.length * 2);
  var view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 32 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, recordSampleRate, true);
  view.setUint32(28, recordSampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);
  floatTo16BitPCM(view, 44, samples);
  
  return view;
}