import AWS_CONSTANTS from '../constants/aws';
import SpeachWriter from './speachWriter';
const doSpeachMethod = Symbol('doSpeachMethod');

class Speaker {
    constructor() {
        this._speachWriter = new SpeachWriter();
        this._playCallback = (err, speachUrl) => {
            this.playNative(speachUrl);
        }
        this._playCallback = this._playCallback.bind(this);
    }

    playNative(url, callback) {
        url = url.replace('file://', '');
        this._media = new Media(url,
            // success callback
            function () {  },
            // error callback
            function (err) { console.log("playAudio():Audio Error: " + JSON.stringify(err)); }
        );
        // Play audio
        this._media.play();
    }
    
    [doSpeachMethod](text) {
        // Create an Polly client
        const Polly = new AWS.Polly({
            signatureVersion: 'v4',
            region: 'us-east-1',
            accessKeyId: AWS_CONSTANTS.accessKeyId,
            secretAccessKey: AWS_CONSTANTS.secretAccessKey
        })

        let params = {
            'Text': text,
            'OutputFormat': 'mp3',
            'VoiceId': 'Matthew'
        }

        Polly.synthesizeSpeech(params, (err, data) => {
            if (err) {
                console.log(err.code)
            } else if (data) {
                if (data.AudioStream) {
                    var audioBlob = new Blob([data.AudioStream]);
                    this._speachWriter.writeToTemporaryFile(audioBlob, this._playCallback);
                }
            }
        })
    }

    speak(text) {
        this._speachWriter.requestTemporaryFileSystem(()=>{
            this[doSpeachMethod](text);
        });
    }

    stop(){
        if(this._media){
            this._media.stop();
        }
    }
}

export default Speaker;