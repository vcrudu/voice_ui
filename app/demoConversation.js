import AWS_CONSTANTS from "./constants/aws";
import Speaker from './polly/speaker';
import {initCanvas} from './lex/renderer';

class DemoConversation {
    startConversation () {
        if(!window.Waveform){
            initCanvas();
        }
        const waveform = window.Waveform();
        const message = document.getElementById('message');
        message.textContent = 'Passive';

        AWS.config.credentials = new AWS.Credentials(AWS_CONSTANTS.accessKeyId, AWS_CONSTANTS.secretAccessKey, null);
        AWS.config.region = AWS_CONSTANTS.region;

        const config = {
            lexConfig: { botName: "OrderFlowers" }
        };

        const Conversation = require('./lex/conversation.js');
        //Conversation(config, onStateChange, onSuccess, onError, onAudioData)
        const conversation = new Conversation(config, function (state) {
            message.textContent = state + '...';
            if (state === 'Listening') {
                waveform.prepCanvas();
            }
            if (state === 'Sending') {
                waveform.clearCanvas();
            }
        }, (data) => {
            console.log('Transcript: ', data.inputTranscript, ", Response: ", data.message);
        },  (error) => {
            message.textContent = error;
        }, (timeDomain, bufferLength) => {
            waveform.visualizeAudioBuffer(timeDomain, bufferLength);
        });
        conversation.advanceConversation();
    }

    startSpeech () {
        const speaker = new Speaker();
        speaker.speak("Hi, I am Mathew and I will assist you to monitor your blood pressure.");
    }
}

export default DemoConversation;