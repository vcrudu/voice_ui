import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
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

  import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
  } from '@rmwc/dialog';

import { Typography } from 'rmwc/Typography';
import Speaker from '../../polly/speaker';

const NoDevices = (<div style={{ marginTop: '20vh', textAlign: 'center', opacity: 0.2 }}>Click the microphone to start</div>);


class HomeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.demoConversation = new DemoConversation();
        this.state = {};
    }

    componentDidMount() {
        this.props.actions.changeScreenTitle('Home');
        if(this.props.currentAction && 
            moment().isAfter(moment(new Date(this.props.currentAction.dateTime))
            .add(this.props.currentAction.timeToLive,'hours'))){
            this.props.actions.removeCurrentAction();
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

    handleAction() {
        if(this.props.currentAction.scenarioTitle!='Summary'){
            this.setState({questionOpen: true});
        } else {
            this.setState({redirectToInfo: true});
        }
    }

    render() {
        if(this.state.redirectToInfo){
            return <Redirect 
            to={`/voice/home/${this.props.currentAction.scenarioId}/${this.props.currentAction.dateTime}/${this.props.currentAction.scenarioTitle}`} />
        }
        if(this.state.questionAnswer && this.state.questionAnswer!='cancel'){
            return <Redirect 
            to={this.state.questionAnswer=='chat'?
            `/chat/home/${this.props.currentAction.scenarioId}/${this.props.currentAction.dateTime}/${this.props.currentAction.scenarioTitle}`
            :`/voice/home/${this.props.currentAction.scenarioId}/${this.props.currentAction.dateTime}/${this.props.currentAction.scenarioTitle}`} />
        } else
        return (
            <div>
                { this.props.currentAction.pictureId?
                (<Card style={{ width: '21rem', marginTop:'5px', marginLeft:'auto', marginRight:'auto' }}>
                    <CardPrimaryAction>
                        {
                            <CardMedia sixteenByNine style={{ backgroundImage: 'url(img/'+this.props.currentAction.pictureId+')', backgroundSize: '65vw 30vh',     backgroundPosition: "center" }} />
                        }
                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                            <Typography use="body1" tag="div" theme="text-secondary-on-background">{this.props.currentAction.message}</Typography>
                        </div>
                    </CardPrimaryAction>
                        <CardActions>
                            <CardActionButtons>
                               <CardAction onClick={() => this.handleAction()}>More info</CardAction>
                            </CardActionButtons>
                        </CardActions>
                </Card>):null
                }

                 {
                   <Dialog
                   open={this.state.questionOpen}
                   onClose={evt => {
                     this.setState({questionOpen: false, questionAnswer:evt.detail.action})
                   }}
                 >
                   <DialogContent>How would you like to talk?</DialogContent>
                   <DialogActions>
                     <DialogButton action="chat">Text</DialogButton>
                     <DialogButton action="voice">Voice</DialogButton>
                     <DialogButton action="cancel">Cancel</DialogButton>
                   </DialogActions>
                 </Dialog>
                 
                } 
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