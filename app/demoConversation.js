import AWS_CONSTANTS from "./constants/aws";
import Speaker from './polly/speaker';

class DemoConversation {
    startConversation(botName, onStateChangeSuccess, onVoiceData, conversationType) {
        if(!window.cordova) return;        
        if (!this.conversation) {
            AWS.config.credentials = new AWS.Credentials(AWS_CONSTANTS.accessKeyId, AWS_CONSTANTS.secretAccessKey, null);
            AWS.config.region = AWS_CONSTANTS.region;

            const config = {
                lexConfig: { botName: botName },
                conversationType: conversationType
            };

            const Conversation = require('./lex/conversation.js');
            //Conversation(config, onStateChange, onSuccess, onError, onAudioData)
            this.conversation = new Conversation(config, function (state) {
                onStateChangeSuccess(state)
            }, (data) => {
                onVoiceData(data);
                console.log('Transcript: ', data.inputTranscript, ", Response: ", data.message);
            }, (error) => {
                console.log(error);
            }, (timeDomain, bufferLength) => {
            });
        }
        this.conversation.advanceConversation();
    }

    sendAnswer(botName, answer, onStateChangeSuccess, onVoiceData, conversationType){
        if(!window.cordova) return;        
        if (!this.conversation) {
            AWS.config.credentials = new AWS.Credentials(AWS_CONSTANTS.accessKeyId, AWS_CONSTANTS.secretAccessKey, null);
            AWS.config.region = AWS_CONSTANTS.region;

            const config = {
                lexConfig: { botName: botName },
                conversationType: conversationType
            };

            const Conversation = require('./lex/conversation.js');
            //Conversation(config, onStateChange, onSuccess, onError, onAudioData)
            this.conversation = new Conversation(config, function (state) {
                onStateChangeSuccess(state)
            }, (data) => {
                onVoiceData(data);
                console.log('Transcript: ', data.inputTranscript, ", Response: ", data.message);
            }, (error) => {
                console.log(error);
            }, (timeDomain, bufferLength) => {
            });
        }
        this.conversation.sendAnswer(answer);
    }


    startSpeech(text, endCallback) {
        if(!window.cordova) return;
        const speaker = new Speaker(endCallback);
        speaker.speak(text);
    }
}

export default DemoConversation;