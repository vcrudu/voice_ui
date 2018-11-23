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
import bleService from '../../model/bleService';
import DemoConversation from '../../demoConversation';

class ChatComponent extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            messages:[],
            currentMessage:'',
            chatHeight:'75vh'
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.handleCurrentMessage = this.handleCurrentMessage.bind(this);
        this.getBackScreenUrl = this.getBackScreenUrl.bind(this);
        this.messageInput = React.createRef();
        this.demoConversation = new DemoConversation();
        this.conversationStateChange = this.conversationStateChange.bind(this);
        this.voiceDataComming = this.voiceDataComming.bind(this);
        this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
        this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
    }

    onKeyboardDidShow(){
        this.setState({chatHeight:'54vh'});
    }

    onKeyboardDidHide(){
        this.setState({chatHeight:'75vh'});
    }

    conversationStateChange(stateTitle) {
        console.log(stateTitle);
    }

    voiceDataComming(voiceData){
        
        var messages = voiceData.message.split('.');

        
        for (let i = 0; i < messages.length; i++) {
                if(messages[i].trim().length>0){
                let chatMessage = {
                    patientCardId: `${this.props.userData.email}#${this.props.match.params.dateTime}`,
                    dateTime: new Date().getTime(),
                    member: 'provider',
                    text: messages[i]
                };
                this.props.actions.addChatMessage(chatMessage);
            }
        }
        let chatMessage = {
            patientCardId: `${this.props.userData.email}#${this.props.match.params.dateTime}`,
            dateTime: new Date().getTime(),
            member: 'provider',
            text: voiceData.message
        };
        chatApiService.sendChatMessages(chatMessage, this.props.userData.token);
        console.log(voiceData);

        if (voiceData.slotToElicit === 'measurementFinished'||voiceData.slots['readyToStart'] === 'No') {
            bleService.takeMeasurement('bloodPressure',(measure)=>{
                this.props.actions.addMeasure(measure);
            },(device)=>{
                this.props.actions.addDevice(device);
            }, this.props.userData.token,
            (measure) => {
                    console.log(measure);
                    let now = moment();
                    let middleDay = now.startOf('day').add(12, 'hours');
                    let chatMessage = {
                        patientCardId: `${this.props.userData.email}#${this.props.match.params.dateTime}`,
                        dateTime: new Date().getTime(),
                        member:'provider',
                        text: "Thanks for providing the measurement. I have received the result. I will help you in the " + (moment().isBefore(middleDay) ? "evening" : "morning") + " to measure the blood pressure again."
                    };
            
                    this.props.actions.addChatMessage(chatMessage);
                    chatApiService.sendChatMessages(chatMessage, this.props.userData.token);
            });
        }
    }

    componentDidMount() {
        window.addEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.addEventListener('keyboardDidHide', this.onKeyboardDidHide);
        this.demoConversation.sendAnswer('MeasureBP', 
            this.props.currentAction.message,
            this.conversationStateChange,
            this.voiceDataComming,
            'text'
        );
        let patientCardId = `${this.props.userData.email}#${this.props.match.params.dateTime}`;
        if (!this.props.chatState[patientCardId]||(this.props.chatState[patientCardId]&&this.props.chatState[patientCardId].length == 0)) {
            chatApiService.getChatMessages(this.props.match.params.dateTime, this.props.userData.token, (err, data) => {
                if (!err) {
                    data.map((message) => {
                        this.props.actions.addChatMessage({
                            patientCardId: message.patientCardId,
                            dateTime: message.dateTime,
                            member: message.member,
                            text: message.text
                        });
                    });
                }
            });
        }
    }

    componentWillUnmount(){
        window.removeEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.removeEventListener('keyboardDidHide', this.onKeyboardDidHide);
    }

    componentDidUpdate(prevProps) {
        this.messageInput.current.input_.focus();
      }

    sendMessage() {
        let chatMessage = {
            patientCardId: `${this.props.userData.email}#${this.props.match.params.dateTime}`,
            dateTime: new Date().getTime(),
            member:'patient',
            text: this.state.currentMessage.toLowerCase()
        }
        this.props.actions.addChatMessage(chatMessage);

        chatApiService.sendChatMessages(chatMessage, this.props.userData.token);

        this.demoConversation.sendAnswer('MeasureBP', 
            this.state.currentMessage,
            this.conversationStateChange,
            this.voiceDataComming,
            'text'
        );
        this.setState({
            currentMessage:''
        });
    }

    handleCurrentMessage(event){
        this.setState({currentMessage: event.target.value});
    }

    getBackScreenUrl(backScreen){
        switch(backScreen){
            case 'chatList':
                return '/stage/chatList';
            default: 
                return '/stage/home/false';
        }
    }

    render(){
        return(
            <div>
                        <LeafHeader backUrl={this.getBackScreenUrl(this.props.match.params.backScreen)} 
                        title={this.props.match.params.scenarioTitle} />

                <div style={{display:'flex',
                    height:this.state.chatHeight, 
                    marginTop:'5vh',
                    flexDirection:'column', 
                    justifyContent:'flex-end',
                    marginRight:'4vw',
                    marginLeft:'4vw',
                    overflowY:'scroll'
                }}>
                { this.props.chatState[`${this.props.userData.email}#${this.props.match.params.dateTime}`]?
                    this.props.chatState[`${this.props.userData.email}#${this.props.match.params.dateTime}`].map((message)=>{
                    return (
                        <div key={message.dateTime}>
                        <div style={{display:'flex',flexDirection:'row-reverse'}}>
                            <div style={message.member=='patient'?
                            {  
                                maxHeight:'30vh',
                                padding: '10px',
                                alignSelf: 'flex-end',
                                borderRadius: '15px 15px 0px 15px',
                                backgroundColor:'#EFEFEF',
                                marginBottom:'1vh',
                                marginLeft:'15vw'
                            }:
                            {     
                                maxHeight:'30vh',
                                padding: '10px',
                                alignSelf: 'flex-start',
                                borderRadius: '0px 15px 15px 15px',
                                backgroundColor:'#EFEFEF',
                                marginBottom:'1vh',
                                marginRight:'15vw'
                            }}><span>{message.text}</span></div>
                            </div>
                        </div>
                   );
                }):null}
                </div>

                <Grid span='4'>

                <GridCell span="3">
                    <Theme options={{
                        primary: 'lightpink',
                        secondary: 'black',
                        onPrimary: '#000',
                        textPrimaryOnBackground: 'white'
                    }}>
                    <TextField ref={this.messageInput} style={{height:'2rem', width:'80vw'}} fullwidth rows='2'
                    value={this.state.currentMessage} onChange={this.handleCurrentMessage}/>
                </Theme>
                </GridCell>
                <GridCell span='1' >
                    <Icon icon="send" style={{position:'relative',left:'13vw'}} onClick={this.sendMessage}></Icon>
                </GridCell>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { chatState: state.chatState, 
        userData: state.userData,
        currentAction:state.currentAction};
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