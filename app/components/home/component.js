import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import * as Actions from '../../actions';
import { Fab } from '@rmwc/Fab';
import {
    List,
    SimpleListItem
} from '@rmwc/List';
import dataStorage from '../../model/DataStorage';
import moment from 'moment';
import DemoConversation from '../../demoConversation'
import apiService from '../../model/apiService';
import { CircularProgress } from '@rmwc/circular-progress';
import _ from 'underscore';


import {
    Card,
    CardPrimaryAction,
    CardMedia,
    CardAction,
    CardActions,
    CardActionButtons
} from '@rmwc/Card';

import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogButton
} from '@rmwc/dialog';

import { Typography } from '@rmwc/Typography';
import Speaker from '../../polly/speaker';

const NoDevices = (<div style={{ marginTop: '20vh', textAlign: 'center', opacity: 0.2 }}>Click the microphone to start</div>);
import chatApiService from '../../model/chatApiService';

class HomeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.demoConversation = new DemoConversation();
        this.state = {};
        this.onFabClick = this.onFabClick.bind(this);
        this.contentHeight = this.contentHeight.bind(this);
    }

    componentDidMount() {
        this.props.actions.changeScreenTitle('Home');
        this.setState({ questionAnswer: null });
        if (this.props.currentAction &&
            moment().isAfter(moment(new Date(this.props.currentAction.dateTime))
                .add(this.props.currentAction.timeToLive, 'hours'))) {
            this.props.actions.removeCurrentAction();
        }
        //if (!this.props.currentAction.scenarioId) {
            /* chatApiService.getCurrentCard(this.props.userData.token, (err, response) => {
                if (response && response.length > 0) {
                    this.props.actions.setCurrentAction(response[0]);
                }
            }); */
            chatApiService.getAllCardds(this.props.userData.token, (err, response) => {
                if (response && response.length > 0) {
                    let sortedList = _.sortBy(response,(card)=>0-card.dateTime)
                    this.props.actions.refreshCards(sortedList);
                }
            });
        //}
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

    contentHeight(){
        if( window.innerHeight &&
            this.props.layoutHeight.toolbarHeight &&
            this.props.layoutHeight.menuHeight){
                const height = window.innerHeight - 
                this.props.layoutHeight.toolbarHeight - 
                this.props.layoutHeight.menuHeight;
            return `${height-10}px`;
        } else '72vh';
    }

    handleAction(card) {
        if (card.scenarioTitle != 'Summary') {
            this.props.actions.setCurrentAction(card);
            this.props.actions.setCurrentChatCommand({ message: card.message});
            this.setState({ questionAnswer: 'go', currentCard:card });
        } else {
            this.setState({ redirectToInfo: true });
        }
    }

    onFabClick() {
        this.setState({ questionAnswer: 'go' });
    }

    render() {
        if (this.state.redirectToInfo) {
            return <Redirect
                to={`/voice/home/${this.props.currentAction.scenarioId}/${this.props.currentAction.dateTime}/${this.props.currentAction.scenarioTitle}`} />
        }
        if (this.state.questionAnswer) {
            const chatUrl = `/chat/home/${this.state.currentCard.scenarioId}/${this.state.currentCard.dateTime}/${this.state.currentCard.scenarioTitle}`;
            const voiceUrl = `/voice/home/${this.state.currentCard.scenarioId}/${this.state.currentCard.dateTime}/${this.state.currentCard.scenarioTitle}`;
            let url = this.props.voiceState.voiceState === 'off'?chatUrl:voiceUrl;
            return <Redirect to={url} />
        } else
            return (
                <div>
                    {
                        this.props.patientCards ?
                        (
                            <div style={{marginTop:'1vh',height:this.contentHeight(), overflowY:'scroll'}}>
                                {
                                    this.props.patientCards.map((card)=>{
                                    return (<Card key={card.dateTime} style={{ width: '21rem', marginTop: '5px', marginLeft: 'auto', marginRight: 'auto' }}>
                                    <CardPrimaryAction>
                                        {
                                            <CardMedia sixteenByNine style={{ backgroundImage: 'url(img/' + card.pictureId + ')', backgroundSize: '65vw 30vh', backgroundPosition: "center" }} />
                                        }
                                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                                            <Typography use="body1" tag="div" theme="text-secondary-on-background">{card.message}</Typography>
                                        </div>
                                    </CardPrimaryAction>
                                    <CardActions>
                                        <CardActionButtons>
                                            <CardAction onClick={() => this.handleAction(card)}>More info</CardAction>
                                        </CardActionButtons>
                                    </CardActions>
                                    </Card>);
                                })
                                }
                            </div>
                        ) : null
                    }

                    <Fab style={{ position: 'fixed', bottom: '15vh', right: '5vh' }} icon='chat'
                        onClick={() => {
                            this.onFabClick();
                        }}
                    ></Fab>
                </div>
            );
    }
}

const mapStateToProps = state => {
    return {
        ...state,
        devices: state.devices,
        measures: state.measures,
        measureCount: state.measureCount,
        voiceState: state.voiceState,
        currentAction: state.currentAction,
        userData: state.userData,
        navigationState: state.navigationState,
        patientCards: state.patientCards,
        menuHeight: state.menuHeight
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