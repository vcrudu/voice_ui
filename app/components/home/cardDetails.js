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
import './styles/card-details.css';
import enableInlineVideo from 'iphone-inline-video';

class ChatComponent extends React.Component {
    constructor(props){
        super(props);
        this.demoConversation = new DemoConversation();
        this.avatar = React.createRef();
        this.onFabClick = this.onFabClick.bind(this);
        this.speaking = this.speaking.bind(this);
        this.listening = this.listening.bind(this);
        this.conversationStateChange = this.conversationStateChange.bind(this);
        this.voiceDataComming = this.voiceDataComming.bind(this);
        this.takeMeasurement = this.takeMeasurement.bind(this);
    }

    componentDidMount() {
        var video = document.querySelector('video');
        enableInlineVideo(video);
        this.avatar.current.loop=true;
        this.listening();
        this.demoConversation.sendAnswer('MeasureBP',
            'Take a measurement.', 
            this.conversationStateChange, 
            this.voiceDataComming); 
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
            this.takeMeasurement((measure) => {
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

    render(){
        return(
            <div>
                <Grid>
                    <GridCell span='4'>
                        <LeafHeader backUrl="/stage/signs" title="Detailed information" />
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

    takeMeasurement(onSuccess){
        console.log('takeMeasurement started');
        var once = false;
        if (window.ble) {
            console.log('Starting to scan');
            setTimeout(()=>{
                ble.startScan([],()=>{console.log('Stop scanning for no activity.');})
            }, 15 * 60 * 1000);
            ble.startScan([], (device) => {
                console.log(device);
                if (device.advertising &&
                    device.advertising.kCBAdvDataServiceUUIDs && device.advertising.kCBAdvDataServiceUUIDs.find((uuid) => uuid === "1810")) {//name==="IH-51-1490-BT"){
                    console.log('Stop scanning');
                    ble.stopScan(() => {
                        this.props.actions.addDevice(device);
                        console.log(JSON.stringify(device))
                        ble.connect(device.id, (peripheralData) => {
                            console.log(peripheralData)
                            ble.startNotification(device.id, '1810', '2A35', (data) => {
                                const intData = new Uint8Array(data);
                                let dateTime = moment();
                                let dateTime2 = moment(dateTime).add(1,'seconds');
                               
                                let bloodPressure = { dateTime: dateTime, systolic: intData[1], diastolic: intData[3], deviceModelType:"BloodPressure" };
                                let heartRate = { dateTime: dateTime2, heartRate: intData[14], deviceModelType: "HeartRate" };
                                this.props.actions.addMeasure(bloodPressure);
                                
                                apiService.sendMeasure(this.props.userData.token,bloodPressure,(error, data)=>{
                                    console.log(data);
                                });
                                apiService.sendMeasure(this.props.userData.token,heartRate,(error, data)=>{
                                    console.log(data);
                                });
                                if(!once){
                                    once = true;
                                    onSuccess(bloodPressure);
                                }
                            }, (error) => {
                                console.log(error)
                            });
                        }, function (error) {
                            console.log(error)
                        });
                    });
                }
            }, (error) => {
                console.log(error)
            });
        }
    }
}

const mapStateToProps = state => {
    return { chatState: state.chatState, 
        voiceState: state.voiceState,
        measureCount: state.measureCount,
        devices: state.devices,
        measures: state.measures,
        userData: state.userData
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const Chat = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatComponent)

export default withRouter(Chat);