import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link,withRouter } from 'react-router-dom';
import * as Actions from '../../actions';
import { Fab } from 'rmwc/Fab';
import {
    List,
    SimpleListItem
} from 'rmwc/List';
import dataStorage from '../../model/DataStorage';
import moment from 'moment';
import DemoConversation from '../../demoConversation'
import apiService from '../../model/apiService';

import {
    Card,
    CardPrimaryAction,
    CardMedia,
    CardAction,
    CardActions,
    CardActionButtons,
    CardActionIcons
  } from 'rmwc/Card';

import { Typography } from 'rmwc/Typography';
import Speaker from '../../polly/speaker';

const NoDevices = (<div style={{ marginTop: '20vh', textAlign: 'center', opacity: 0.2 }}>Click the microphone to start</div>);


class HomeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.demoConversation = new DemoConversation();
        this.onFabClick=this.onFabClick.bind(this);
    }

    componentDidMount() {
        if(this.props.match.params.startAssistant==='true'){
            this.onFabClick();
        }
        this.props.actions.changeScreenTitle('Home');
    }

    componentWillUnmount() {
        if (window.ble) {
            ble.stopScan([], (args) => {
                console.log(args)
            }, (error) => {
                console.log(error)
            });
        }
    }

    takeMeasurement(onSuccess) {
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
                                let dateTime = moment({ years:moment().year(), months:intData[9], days:intData[10], hours:intData[11], minutes:intData[12], seconds:moment().second()});
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

    onFabClick() {
        //if(!this.props.voiceState.microphoneOn) {
            //this.props.actions.switchMicrophone();
            this.demoConversation.startConversation('MeasureBP', (stateTitle) => {
                this.props.actions.changeDialogState(stateTitle);
            }, (voiceData) => {
                console.log(voiceData.slotToElicit);
                if (voiceData.slotToElicit === 'measurementFinished'||voiceData.slots['readyToStart'] === 'no') {
                    this.takeMeasurement((measure) => {
                        this.props.actions.addMeasureCount();
                        if (this.props.measureCount.count < 2) {
                            this.demoConversation.sendAnswer("Yes it has finished.");
                        } else {
                            let now = moment();
                            let middleDay = now.startOf('day').add(12, 'hours');
                            this.demoConversation.startSpeech("Thanks for providing the measurement. I have received the result. I will help you in the " + (moment().isBefore(middleDay) ? "evening" : "morning") + " to measure the blood pressure again. Have a good time!");
                            //this.props.actions.switchMicrophone(); 
                        }
                    });
                } else {
                    //this.props.actions.switchMicrophone();                    
                }
                console.log(voiceData);
            });
        //}
    }

    handleAction(action) {
        return;
        switch (action.actionType) {
            case 'readText':
                let speaker = new Speaker();
                speaker.speak(this.props.currentAction.text);
                break;
            case 'bot':
                this.demoConversation.sendAnswer(action.botName, action.botTriggerText, (stateTitle) => {
                    this.props.actions.changeDialogState(stateTitle);
                }, (voiceData) => {
                    console.log(voiceData.slotToElicit);
                    if (voiceData.slotToElicit === 'measurementFinished') {
                        this.takeMeasurement((measure) => {
                            this.props.actions.addMeasureCount();
                            if (this.props.measureCount.count < 2) {
                                this.demoConversation.sendAnswer("Yes it has finished.");
                            } else {
                                let now = moment();
                                let middleDay = now.startOf('day').add(12, 'hours');
                                this.demoConversation.startSpeech("Thanks for providing the measurement. I have received the result. I will help you in the " + (moment().isBefore(middleDay) ? "evening" : "morning") + " to measure the blood pressure again. Have a good time!");
                                //this.props.actions.switchMicrophone(); 
                            }
                        });
                    } else {
                        //this.props.actions.switchMicrophone();                    
                    }
                    console.log(voiceData);
                });
                break;
                case 'acknowledge':
                this.props.actions.setCurrentAction(null);
                let speaker1 = new Speaker();
                speaker1.speak("Thank you, I will remind you next time according to the prescription schedule.");
                break;
            default:
                return;
        }
    }

    render() {
        return (
            <div >
                { this.props.currentAction && this.props.currentAction.title?
                (<Card style={{ width: '21rem', marginTop:'5px', marginLeft:'auto', marginRight:'auto' }}>
                    <CardPrimaryAction>
                        {
                            this.props.currentAction.id!=="TakeDrug" && this.props.currentAction.id!=="EnrolPatientForTreatment"?
                            <CardMedia sixteenByNine style={{ backgroundImage: 'url(img/blood-pressure-measure-01.png)',     backgroundPosition: "center" }} />
                            :null
                        }
                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                            <Typography use="title" tag="h2">{this.props.currentAction.title}</Typography>
                            <Typography use="body1" tag="div" theme="text-secondary-on-background">{this.props.currentAction.subtitle}</Typography>
                        </div>
                    </CardPrimaryAction>
                        <CardActions>
                            <CardActionButtons>
                                {
                                    this.props.currentAction.actions.map((action) => {
                                        return  <CardAction key={action.actionType} onClick={() => this.handleAction(action)}><Link to='/card_details'>{action.actionLabel}</Link></CardAction>
                                    })
                                }
                            </CardActionButtons>
                        </CardActions>
                </Card>):null
                }

                 {
                     (<List twoLine>
                     {window.notifications.map((notification) => {
                        return <SimpleListItem key={notification.index} graphic="favorite" text={`${notification.notification}`}  meta="info" />
                    })}
                    </List>)
                   /*  this.props.measures.length == 0 ? NoDevices :
                        (<List twoLine>
                            {
                                this.props.measures.map((measure) => {
                                    return <SimpleListItem key={measure.dateTime} graphic="favorite" text={`${measure.systolic}/${measure.diastolic}`} secondaryText={moment(measure.dateTime).format("llll")} meta="info" />
                                })
                            }
                        </List>) */
                } 
                <Fab style={{ position: 'fixed', bottom: '15vh', right: '5vh' }} onClick={this.onFabClick} icon='settings_voice'></Fab>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { ...state,
        devices: state.devices,
        measures: state.measures,
        measureCount: state.measureCount,
        voiceState: state.voiceState,
        currentAction: state.currentAction,
        userData: state.userData,
        navigationState: state.navigationState
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const Home = connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeComponent)

export default withRouter(Home);