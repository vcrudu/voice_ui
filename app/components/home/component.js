import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
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
        if (window.ble) {
            console.log('Starting to scan');
            ble.startScan([], (device) => {
                console.log(device);
                if (device.advertising &&
                    device.advertising.kCBAdvDataServiceUUIDs && device.advertising.kCBAdvDataServiceUUIDs.find((uuid) => uuid === "1810") || device.name==="IH-51-1490-BT" ) {//name==="IH-51-1490-BT"){
                    console.log('Stop scanning');
                    ble.stopScan(() => {
                        this.props.actions.addDevice(device);
                        console.log(JSON.stringify(device))
                        ble.connect(device.id, (peripheralData) => {
                            console.log(peripheralData)
                            ble.startNotification(device.id, '1810', '2A35', (data) => {
                                const intData = new Uint8Array(data);
                                let measure = { dateTime: Date.now(), systolic: intData[1], diastolic: intData[3], deviceModelType:"BloodPressure" };
                                this.props.actions.addMeasure(measure);
                                
                                apiService.sendMeasure(this.props.userData.token,measure,(error, data)=>{
                                    console.log(data);
                                });
                                onSuccess(measure);
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
            //this.props.actions.clickMicrophone();
            this.demoConversation.startConversation('MeasureBP', (stateTitle) => {
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
                            //this.props.actions.clickMicrophone(); 
                        }
                    });
                } else {
                    //this.props.actions.clickMicrophone();                    
                }
                console.log(voiceData);
            });
        //}
    }

    handleAction(action) {
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
                                //this.props.actions.clickMicrophone(); 
                            }
                        });
                    } else {
                        //this.props.actions.clickMicrophone();                    
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
                            <CardMedia sixteenByNine style={{ backgroundImage: 'url(img/blood-pressure-measure-01.png)', backgroundPosition: "center" }} />
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
                                        return <CardAction key={action.actionType} onClick={() => this.handleAction(action)}>{action.actionLabel}</CardAction>
                                    })
                                }
                            </CardActionButtons>
                        </CardActions>
                </Card>):null
                }

                 {
                   /*  this.props.measures.length == 0 ? NoDevices :
                        (<List twoLine>
                            {
                                this.props.measures.map((measure) => {
                                    return <SimpleListItem key={measure.dateTime} graphic="favorite" text={`${measure.systolic}/${measure.diastolic}`} secondaryText={moment(measure.dateTime).format("llll")} meta="info" />
                                })
                            }
                        </List>) */
                } 
                <Fab style={{ position: 'fixed', bottom: '12vh', right: '5vh' }} onClick={this.onFabClick}>settings_voice</Fab>
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
        currentAction: state.currentAction
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