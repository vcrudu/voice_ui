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

class ChatComponent extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            messages:[],
            currentMessage:''
        };
        this.props.actions.clearChatMessage();
        this.sendMessage = this.sendMessage.bind(this);
        this.handleCurrentMessage = this.handleCurrentMessage.bind(this);
    }

    componentDidMount() {
        chatApiService.getChatMessages(this.props.userData.email, (err, data)=>{
            if (!err) {
                data.map((message) => {
                    this.props.actions.addChatMessage({
                        datetime: message.datetime,
                        member: message.member,
                        text: message.text
                    });
                });
            }
        });
    }

    sendMessage() {
        let message = { 
            datetime:moment().valueOf(), 
            member: 'patient', 
            text: this.state.currentMessage 
        };
        this.props.actions.addChatMessage(message);

        chatApiService.sendChatMessages(this.props.userData.email, message);

        this.setState({
            currentMessage:''
        });
    }

    handleCurrentMessage(event){
        this.setState({currentMessage: event.target.value});
    }

    render(){
        return(
            <div>
                <Grid>
                    <GridCell span='4'>
                        <LeafHeader backUrl="/stage/chatList" title="Main chat" />
                    </GridCell>
                </Grid>
                <Grid>
                </Grid>

                <div style={{display:'flex',
                    height:'75vh', 
                    marginTop:'5vh',
                    flexDirection:'column', 
                    justifyContent:'flex-end',
                    marginRight:'4vw',
                    marginLeft:'4vw',
                    overflow:'scroll'
                }}>
                {this.props.chatState.map((message)=>{
                    return (
                        <div key={message.datetime}>
                        <div style={{display:'flex',flexDirection:'row-reverse'}}>
                            <div style={message.member=='patient'?
                            {  
                                maxHeight:'20vh',
                                padding: '10px',
                                alignSelf: 'flex-end',
                                borderRadius: '15px 15px 0px 15px',
                                backgroundColor:'#EFEFEF',
                                marginBottom:'1vh',
                                marginLeft:'15vw'
                            }:
                            {     
                                maxHeight:'20vh',
                                padding: '10px',
                                alignSelf: 'flex-end',
                                borderRadius: '0px 15px 15px 15px',
                                backgroundColor:'#EFEFEF',
                                marginBottom:'1vh',
                                marginRight:'15vw'
                            }}><span>{message.text}</span></div>
                            </div>
                        </div>
                   );
                })}
                </div>

                <Grid span='4'>

                <GridCell span="3">
                    <Theme options={{
                        primary: 'lightpink',
                        secondary: 'black',
                        onPrimary: '#000',
                        textPrimaryOnBackground: 'white'
                    }}>
                    <TextField style={{height:'2rem', width:'80vw'}} fullwidth rows='2'
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
    return { chatState: state.chatState, userData: state.userData};
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