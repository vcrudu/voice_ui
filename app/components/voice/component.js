import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LeafHeader from '../shared/leafHeader';
import { Grid, GridCell } from '@rmwc/Grid';
import { TextField, TextFieldIcon, TextFieldHelperText } from '@rmwc/textfield';
import apiService from '../../model/apiService';
import ValidationInput from '../shared/ValidationInput';
import SecurityStorage from '../../model/SecurityStorage'
import * as Actions from '../../actions'
import { Theme } from '@rmwc/theme';
import { Icon } from '@rmwc/icon';
import { Chip, ChipText, ChipIcon, ChipSet } from '@rmwc/chip';
import moment from 'moment';
import chatApiService from '../../model/chatApiService';
import { Fab } from '@rmwc/Fab';
import DemoConversation from '../../demoConversation'
import './voice.css';
import enableInlineVideo from 'iphone-inline-video';
import bleService from '../../model/bleService';
import { Card, CardPrimaryAction, CardAction, CardActions } from '@rmwc/card';
import { Typography } from '@rmwc/typography';

class VoiceComponent extends React.Component {
    constructor(props) {
        super(props);
        this.demoConversation = new DemoConversation();
        this.avatar = React.createRef();
        this.onFabClick = this.onFabClick.bind(this);
        this.speaking = this.speaking.bind(this);
        this.listening = this.listening.bind(this);
        this.conversationStateChange = this.conversationStateChange.bind(this);
        this.voiceDataComming = this.voiceDataComming.bind(this);
        this.onChatbotResponse = this.onChatbotResponse.bind(this);
        this.saveChatMessage = this.saveChatMessage.bind(this);
    }

    componentDidMount() {
        var video = document.querySelector('video');
        enableInlineVideo(video);
        this.avatar.current.loop = true;
        this.listening();
        chatApiService.sendRequest({
            "inputText": this.props.currentChatCommand.message
        }, this.props.userData.token, this.onChatbotResponse);
        this.saveChatMessage(this.props.currentChatCommand.message, 'provider');
    }

    saveChatMessage(text, member){
        let chatMessage = {
            patientCardId: `${this.props.userData.email}#${this.props.match.params.dateTime}`,
            dateTime: new Date().getTime(),
            member: member,
            text: text
        };
        chatApiService.sendChatMessages(chatMessage, this.props.userData.token);
        this.props.actions.addChatMessage(chatMessage);
    }

    speaking() {
        this.avatar.current.pause();
        this.avatar.current.src = 'img/avatar_w_trimed.mp4';
        this.avatar.current.load();
        this.avatar.current.play();
    }

    listening() {
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
        if (stateTitle == 'Passive') {
            this.props.actions.switchMicrophone('off');
        }
        this.props.actions.changeScreenTitle(stateTitle);
    }

    voiceDataComming(voiceData) {
        let request = this.props.dialogState;
        request.inputText = voiceData.transcript;
        this.props.actions.updateDialogState(request);
        chatApiService.sendRequest(request, 
            this.props.userData.token, this.onChatbotResponse);
        this.saveChatMessage(request.inputText, 'patient');
        console.log(voiceData);
    }

    onChatbotResponse(err, response) {
        this.props.actions.updateDialogState(response);
        this.saveChatMessage(response.state.outputText, 'provider');
        if (response.currentStateName==="endMessage"){
            apiService.markMessageRead(this.props.userData.token,()=>{

            });
        }
        if (response.state && response.state.action) {
            bleService.takeMeasurement(response.state.action, (measure) => {
                this.props.actions.addMeasure(measure);
            }, (device) => {
                this.props.actions.addDevice(device);
            }, this.props.userData.token,
                (measure) => {
                    console.log(measure);
                    let request = response;
                    request.inputText = response.action=='bp'?
                        `Done, it is ${measure.systolic}/${measure.diastolic}`:
                        `Done, it is ${measure.weight}`;
                    this.props.actions.updateDialogState(request);
                    chatApiService.sendRequest(request,
                        this.props.userData.token,
                        this.onChatbotResponse);
                    this.saveChatMessage(response.state.outputText, 'patient');
                });
        }
            this.conversationStateChange('Speaking');
            this.demoConversation.startSpeech(response.state.outputText, () => {
                this.conversationStateChange('Passive');
            });
    }

    onFabClick() {
        if (this.props.voiceState.microphoneState == 'off') {
            this.props.actions.switchMicrophone('on');
            this.demoConversation.transcribeAudio(
                this.conversationStateChange,
                this.voiceDataComming);
        }
    }

    getBackScreenUrl(backScreen) {
        switch (backScreen) {
            case 'chatList':
                return '/stage/chatList';
            case 'signs':
                return '/stage/signs'
            default:
                return '/stage/home/false';
        }
    }

    render() {
        return (
            <div>
                <Grid>
                    <GridCell span='4'>
                        <LeafHeader backUrl={this.getBackScreenUrl(this.props.match.params.backScreen)}
                            title={this.props.match.params.title} />
                    </GridCell>
                </Grid>
                <div style={{ margin: 'auto', position: 'absolute', left: '60px', overflow: 'hidden', width: '220px' }}>
                    <div style={{ position: 'relative', top: '10px', left: '10px' }}>
                        <video ref={this.avatar} width="220" playsInline muted poster='img/poster.png'>
                            <source src="img/avatar_w_listening.mp4" type="video/mp4"></source>
                        </video>
                    </div>
                </div>
                <div style={{ position: 'relative', top: '250px', left: '20px' }}>
                    {
                        this.props.match.params.scenarioTitle == 'Summary' ?
                            (
                                <Card outlined style={{ width: '21rem' }}>
                                    <CardPrimaryAction>
                                        <div style={{ padding: '1rem' }}>
                                            <Typography use="headline5" tag="div">
                                                Summary of the progress
                                </Typography>
                                            <Typography use="body1" tag="p" theme="text-secondary-on-background">
                                                <b>Blood pressure:</b> 145/93 mmHg
                                </Typography>
                                            <Typography use="body1" tag="p" theme="text-secondary-on-background">
                                                <b>Blood pressure trend:</b> Decreased by 1 mmHg
                                </Typography>
                                            <Typography use="body1" tag="p" theme="text-secondary-on-background">
                                                <b>Weight:</b> 75.3
                                </Typography>
                                            <Typography use="body1" tag="p" theme="text-secondary-on-background">
                                                <b>Weight trend:</b> Decreased by 1.5 kg
                                </Typography>
                                            <Typography use="body1" tag="p" theme="text-secondary-on-background">
                                                <b>Activity for day:</b> 20 minutes.
                                </Typography>
                                            <Typography use="body1" tag="p" theme="text-secondary-on-background">
                                                <b>Activity for week:</b> 93 minutes.
                                </Typography>
                                        </div>
                                    </CardPrimaryAction>
                                </Card>
                            )
                            : null}
                </div>
                {
                    (this.props.voiceState.microphoneState == 'on') ?
                        (
                            <Fab style={{ position: 'fixed', bottom: '9vh', right: '5vh' }}
                                onClick={this.onFabClick} icon='mic'>
                            </Fab>
                        ) : (
                            <Fab style={{ position: 'fixed', bottom: '9vh', right: '5vh' }}
                                onClick={this.onFabClick} icon='mic_off'>
                            </Fab>
                        )
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        chatState: state.chatState,
        voiceState: state.voiceState,
        measureCount: state.measureCount,
        devices: state.devices,
        measures: state.measures,
        userData: state.userData,
        currentAction: state.currentAction,
        currentChatCommand: state.currentChatCommand,
        dialogState: state.dialogState,
        navigationState: state.navigationState
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