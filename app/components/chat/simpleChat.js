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
import moment from 'moment';
import chatApiService from '../../model/chatApiService';
import bleService from '../../model/bleService';
import DemoConversation from '../../demoConversation';
import { CircularProgress } from '@rmwc/circular-progress';
import '@rmwc/circular-progress/circular-progress.css';

class ChatComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            currentMessage: '',
            chatHeight: '75vh',
            justifyContent: 'flex-end'
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.handleCurrentMessage = this.handleCurrentMessage.bind(this);
        this.getBackScreenUrl = this.getBackScreenUrl.bind(this);
        this.messageInput = React.createRef();
        this.listRef = React.createRef();
        this.demoConversation = new DemoConversation();
        this.conversationStateChange = this.conversationStateChange.bind(this);
        this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
        this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
        this.saveChatMessage = this.saveChatMessage.bind(this);
        this.onChatbotResponse = this.onChatbotResponse.bind(this);
        this.shouldScroll = this.shouldScroll.bind(this);
    }

    onKeyboardDidShow() {
        this.setState({ chatHeight: '54vh' });
    }

    onKeyboardDidHide() {
        this.setState({ chatHeight: '75vh' });
    }

    conversationStateChange(stateTitle) {
        console.log(stateTitle);
    }

    scrollDown() {
        const list = this.listRef.current;
        list.scrollTop = list.scrollHeight;
    }

    saveChatMessage(text, member) {
        let chatMessage = {
            patientCardId: `${this.props.userData.email}#${this.props.match.params.dateTime}`,
            dateTime: new Date().getTime(),
            member: member,
            text: text
        };
        this.props.actions.addChatMessage(chatMessage);
    }

    componentDidMount() {
        window.addEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.addEventListener('keyboardDidHide', this.onKeyboardDidHide);

       

        chatApiService.sendRequest({
            "inputText": this.props.currentAction.message
        }, this.props.userData.token, this.onChatbotResponse);
        this.saveChatMessage(this.props.currentAction.message, 'provider');
        this.scrollDown();
    }
    componentWillUnmount(){
        window.removeEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.removeEventListener('keyboardDidHide', this.onKeyboardDidHide);
    }

    onChatbotResponse(err, response) {
        this.props.actions.updateDialogState(response);
        this.saveChatMessage(response.state.outputText, 'provider');
        if (response.state.action) {
            bleService.takeMeasurement(response.state.action, (measure) => {
                this.props.actions.addMeasure(measure);
            }, (device) => {
                this.props.actions.addDevice(device);
            }, this.props.userData.token,
                (measure) => {
                    console.log(measure);
                    let request = response;
                    request.inputText = response.state.action == 'bp' ?
                        `Done, it is ${measure.systolic}/${measure.diastolic}` :
                        `Done, it is ${measure.weight}`;
                    this.props.actions.updateDialogState(request);
                    chatApiService.sendRequest(request,
                        this.props.userData.token,
                        this.onChatbotResponse);
                    this.saveChatMessage(request.inputText, 'patient');
                });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.removeEventListener('keyboardDidHide', this.onKeyboardDidHide);
    }

    componentDidUpdate(prevProps) {
        this.scrollDown();
        this.messageInput.current.input_.focus();
    }

    sendMessage() {
        let request = this.props.dialogState;
        request.inputText = this.state.currentMessage;
        this.props.actions.updateDialogState(request);
        chatApiService.sendRequest(request,
            this.props.userData.token, this.onChatbotResponse);
        this.saveChatMessage(request.inputText, 'patient');

        this.setState({
            currentMessage: ''
        });
        if (window.Keyboard) window.Keyboard.hide();
    }

    handleCurrentMessage(event) {
        this.setState({ currentMessage: event.target.value });
    }

    getBackScreenUrl(backScreen) {
        switch (backScreen) {
            case 'chatList':
                return '/stage/chatList';
            default:
                return '/stage/home/false';
        }
    }

    shouldScroll(){
        var messages = this.props.chatState[`${this.props.userData.email}#${this.props.match.params.dateTime}`];
        return messages && messages.length >= 11;
    }

    render() {
        return (
            <div>
                <LeafHeader backUrl={this.getBackScreenUrl(this.props.match.params.backScreen)}
                    title={this.props.match.params.scenarioTitle} />

                <div ref={this.listRef} style={{
                    display: this.shouldScroll()?'auto':'flex',
                    height: this.state.chatHeight,
                    marginTop: '5vh',
                    flexDirection: 'column',
                    justifyContent: this.state.justifyContent,
                    marginRight: '4vw',
                    marginLeft: '4vw',
                    overflowY: 'scroll'
                }}>
                    {this.props.chatState[`${this.props.userData.email}#${this.props.match.params.dateTime}`] ?
                        this.props.chatState[`${this.props.userData.email}#${this.props.match.params.dateTime}`].map((message) => {
                            return (
                                <div key={message.dateTime}>
                                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                        <div style={message.member == 'patient' ?
                                            {
                                                maxHeight: '30vh',
                                                padding: '10px',
                                                alignSelf: 'flex-end',
                                                borderRadius: '15px 15px 0px 15px',
                                                backgroundColor: '#EFEFEF',
                                                marginBottom: '1vh',
                                                marginLeft: '15vw'
                                            } :
                                            {
                                                maxHeight: '30vh',
                                                padding: '10px',
                                                alignSelf: 'flex-start',
                                                borderRadius: '0px 15px 15px 15px',
                                                backgroundColor: '#2976C8',
                                                color:'white',
                                                marginBottom: '1vh',
                                                marginRight: '15vw'
                                            }}><span>{message.text}</span>
                                            </div>
                                    </div>
                                </div>
                            );
                        }) : null}
                </div>

                <Grid span='4'>

                    <GridCell span="3">
                        <Theme options={{
                            primary: 'lightpink',
                            secondary: 'black',
                            onPrimary: '#000',
                            textPrimaryOnBackground: 'white'
                        }}>
                            <TextField ref={this.messageInput} style={{ height: '2rem', width: '80vw' }} fullwidth rows='2'
                                value={this.state.currentMessage} onChange={this.handleCurrentMessage} />
                        </Theme>
                    </GridCell>
                    <GridCell span='1' >
                        <Icon icon="send" style={{ position: 'relative', left: '13vw' }} onClick={this.sendMessage}></Icon>
                    </GridCell>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        chatState: state.chatState,
        userData: state.userData,
        currentAction: state.currentAction,
        dialogState: state.dialogState
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