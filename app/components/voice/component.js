import React from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Button } from 'rmwc/Button';
import LeafHeader from '../shared/leafHeader';
import { Grid, GridCell } from 'rmwc/Grid';
import { TextField, TextFieldIcon, TextFieldHelperText } from '@rmwc/textfield';
import apiService from '../../model/apiService';
import ValidationInput from '../shared/ValidationInput';
import SecurityStorage from '../../model/SecurityStorage'
import * as Actions from '../../actions'
import { Theme } from '@rmwc/theme';
import { Icon } from 'rmwc/icon';
import { Chip, ChipText, ChipIcon, ChipSet } from '@rmwc/chip';
import moment from 'moment';
import chatApiService from '../../model/chatApiService';
import { Fab } from 'rmwc/Fab';
import DemoConversation from '../../demoConversation'
import './voice.css';
import enableInlineVideo from 'iphone-inline-video';
import bleService from '../../model/bleService';

class VoiceComponent extends React.Component {
    constructor(props){
        super(props);
        this.demoConversation = new DemoConversation();
        this.avatar = React.createRef();
        this.onFabClick = this.onFabClick.bind(this);
        this.speaking = this.speaking.bind(this);
        this.listening = this.listening.bind(this);
        this.conversationStateChange = this.conversationStateChange.bind(this);
        this.voiceDataComming = this.voiceDataComming.bind(this);
    }

    componentDidMount() {
        var video = document.querySelector('video');
        enableInlineVideo(video);
        this.avatar.current.loop = true;
        this.listening();
        this.demoConversation.sendAnswer('MeasureBP',
            this.props.currentAction.message ?
                this.props.currentAction.message : this.props.currentChatCommand.message,
            this.conversationStateChange,
            this.voiceDataComming,
            'voice');
    }

    speaking(){
        this.avatar.current.pause();
        this.avatar.current.src = 'img/avatar_w_trimed.mp4';
        this.avatar.current.load();
        this.avatar.current.play();
    }

    listening(){
        this.avatar.current.pause();
        this.avatar.current.src = 'img/avatar_w_listening.mp4';
        this.avatar.current.load();
        this.avatar.current.play();
    }

    conversationStateChange(stateTitle) {
        if (stateTitle == 'Speaking') {
            this.speaking();
        } else {
            this.listening();
        }
        if(stateTitle == 'Passive'){
            this.props.actions.switchMicrophone('off'); 
        }
        this.props.actions.changeDialogState(stateTitle);
    }

    voiceDataComming(voiceData){
        console.log(voiceData.slotToElicit);
        if (voiceData.slotToElicit === 'measurementFinished'||voiceData.slots['readyToStart'] === 'no') {
            bleService.takeMeasurement(this.props.currentChatCommand.measureType,(measure)=>{
                this.props.actions.addMeasure(measure);
            },(device)=>{
                this.props.actions.addDevice(device);
            }, this.props.userData.token,
            (measure) => {
                console.log(measure);
                this.props.actions.addMeasureCount();
                if (this.props.measureCount.count < 2) {
                    this.demoConversation.sendAnswer("Yes it has finished.");
                } else {
                    let now = moment();
                    let middleDay = now.startOf('day').add(12, 'hours');
                    this.speaking();
                    this.demoConversation.startSpeech("Thanks for providing the measurement. I have received the result. I will help you in the " + (moment().isBefore(middleDay) ? "evening" : "morning") + " to measure the blood pressure again. Have a good time!"
                    , ()=>{
                        this.listening();
                        this.props.actions.switchMicrophone('off');
                    });
                }
            });
        } else {
            this.props.actions.switchMicrophone('off');                    
        }
        console.log(voiceData);
    }

    onFabClick() {
        if(this.props.voiceState.microphoneState=='off') {
            this.props.actions.switchMicrophone('on');
            this.demoConversation.startConversation('MeasureBP',
            this.conversationStateChange,
            this.voiceDataComming);
        }
    }

    getBackScreenUrl(backScreen){
        switch(backScreen){
            case 'chatList':
                return '/stage/chatList';
            case 'signs':
                return '/stage/signs'
            default: 
                return '/stage/home/false';
        }
    }

    render(){
        return(
            <div>
                <Grid>
                    <GridCell span='4'>
                        <LeafHeader backUrl={this.getBackScreenUrl(this.props.match.params.backScreen)} 
                        title={this.props.match.params.scenarioTitle} />
                    </GridCell>
                </Grid>
                <Grid>
                </Grid>
                <div style={{margin:'auto',position:'absolute', left:'60px', overflow:'hidden', width:'220px'}}>
                <div style={{position:'relative', top:'10px', left:'10px'}}>
                    <video ref={this.avatar} width="220" playsInline muted>
                    <source src="img/avatar_w_listening.mp4" type="video/mp4"></source>
                    </video>
                </div>
                </div>
                {
                    (this.props.voiceState.microphoneState=='on') ?
                        (   
                            <Fab style={{ position: 'fixed', bottom: '15vh', right: '5vh' }} 
                            onClick={this.onFabClick} icon='mic'>
                            </Fab>
                        ) : (   
                            <Fab style={{ position: 'fixed', bottom: '15vh', right: '5vh' }} 
                            onClick={this.onFabClick} icon='mic_off'>
                            </Fab>
                        )
                }
                </div>
        );
    }
}

const mapStateToProps = state => {
    return { chatState: state.chatState, 
        voiceState: state.voiceState,
        measureCount: state.measureCount,
        devices: state.devices,
        measures: state.measures,
        userData: state.userData,
        currentAction:state.currentAction,
        currentChatCommand:state.currentChatCommand
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const Voice = connect(
    mapStateToProps,
    mapDispatchToProps
)(VoiceComponent)

export default withRouter(Voice);