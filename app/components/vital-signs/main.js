import React, { Component } from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions';
import PropTypes from 'prop-types';
import VitalSignsFactory from '../../model/VitalSignsFactory';
import apiService from '../../model/apiService';
import healthKitService from '../../model/healthKitService';
import moment from 'moment';
import _ from 'underscore';
import * as d3 from "d3";
import bleService from '../../model/bleService';
import { LinearProgress } from '@rmwc/linear-progress';

import './styles/charts.scss'
import '@material/card/dist/mdc.card.css';
import '@material/button/dist/mdc.button.css';
import '@material/icon-button/dist/mdc.icon-button.css';
import '@material/theme/dist/mdc.theme.css';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
} from '@rmwc/dialog';

import Average from './average';


class SignsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newHealthKitData: false};
        this.onFabClick = this.onFabClick.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.onHealthKitReceivedData = this.onHealthKitReceivedData.bind(this);
        this.onBulkEventsResponse = this.onBulkEventsResponse.bind(this);
        this.contentHeight = this.contentHeight.bind(this);
    }

    onFabClick() {
    }

    componentDidMount() {
        apiService.getDashboard(this.props.userData.token,(err,response)=>{
            healthKitService.queryToday('distance',(data)=>{
                response.splice(2, 0, {
                    summaryId: 'distance',
                    title: 'Walking + Running Distance',
                    description: 'Today',
                    value: data.value/1000,
                    unit: 'km',
                    dateTime: moment().format('MMM Do HH:mm'),
                    color: data.color,
                });
                this.setState({dashboardCards:response});
            }, (error)=>{

            });
        });
        this.props.actions.changeScreenTitle('My data');

        if (healthKitService.isAvailable()) {
            healthKitService.queryDataMultiple(this.props.healthKitSyncDate,
                ["weight", "blood_pressure","appleExerciseTime"],
                this.onHealthKitReceivedData, (err) => {
                console.log(JSON.stringify(err));
            });
        }
    }

    onHealthKitReceivedData(data){
        if (data && data.length > 0) {
            const syncHealthKitEndDate =
                moment(data[data.length - 1].endDate).add(1,'m').valueOf();
                this.setState({
                    newHealthKitData: data,
                    syncHealthKitEndDate: syncHealthKitEndDate,
                    newHealthKitDataDialog: true
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

    yesImport() {
        this.setState({ synching: true, newHealthKitDataDialog: false });
        const events = this.state.newHealthKitData.map((healthKitItem) => {
            switch(healthKitItem.dataType){
                case "bloodPressure":
                    return {
                        bloodPressure: {
                            diastolic: healthKitItem.value.diastolic,
                            systolic: healthKitItem.value.systolic
                        },
                        measurementDateTime: moment(healthKitItem.startDate).valueOf(),
                        deviceModelType: "BloodPressure"
                    };
                    break;
                case "weight":
                    return {
                        weight: healthKitItem.value,
                        measurementDateTime: moment(healthKitItem.startDate).valueOf(),
                        deviceModelType: "Weight"
                    };
                    break;
                case "exercise":
                    return {
                        exercise: healthKitItem.value,
                        measurementDateTime: moment(healthKitItem.startDate).valueOf(),
                        deviceModelType: "Exercise"
                    };
                    break;
                default: 
                    return {
                        unknown: healthKitItem.value,
                        measurementDateTime: moment(healthKitItem.startDate).valueOf(),
                        deviceModelType: "Unknown"
                    }
                };
            });
            
        apiService.sendBulkEvents(this.props.userData.token,
            events,
            this.onBulkEventsResponse
        );
    }

    onBulkEventsResponse(err, response) {
        console.log(err);
        if (!err) {
            this.setState({
                newHealthKitData: null,
                newHealthKitDataDialog: false,
                newHealthKitDataCompletedDialog: true,
                synching: false,
                resultText: "Information was imported successfully."
            });
            this.props.actions.updateHealthKitSyncDate(this.state.syncHealthKitEndDate);
        } else {
            this.setState({
                newHealthKitData: null,
                newHealthKitDataDialog: false,
                newHealthKitDataCompletedDialog: true,
                synching: false,
                resultText: "There was an error during importing. Please try again latter."
            });
        }
    }

    noImport(){
        this.setState({newHealthKitData:null, newHealthKitDataDialog: false});
    }

    okImportCompleted(){
        this.setState({
            newHealthKitDataCompletedDialog: false
        });
    }

    onCardClick(){

    }

//amber '#ffa000'
    render() {
        return this.state.dashboardCards ?
            (<div style={{ height: this.contentHeight(), overflowY: 'scroll' }}>
                {
                    this.state.dashboardCards.map((card) => {
                        return (
                            <Link style={{textDecoration:'none'}} key={card.summaryId} to={`/${card.summaryId}`}>
                                <Average
                                    title={card.title}
                                    description={card.description}
                                    value={card.value}
                                    unit={card.unit}
                                    dateTime={card.dateTime}
                                    color={card.color}
                                    isNarative={card.isNarative}
                                    onClick={this.onCardClick}
                                    summaryId={card.summaryId}
                                ></Average>
                            </Link>
                        )
                    })
                }
                <Dialog open={this.state.newHealthKitDataDialog}>
                    <DialogTitle>Sync</DialogTitle>
                    <DialogContent>{`There are new measures in Health Kit repository, would you like to import the measures starting from ${moment(this.props.healthKitSyncDate).format('llll')} ?`}</DialogContent>
                    <DialogActions>
                        <DialogButton onClick={() => this.yesImport()} isDefaultAction>Yes</DialogButton>
                        <DialogButton onClick={() => this.noImport()}>No</DialogButton>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.newHealthKitDataCompletedDialog}>
                    <DialogTitle>Sync</DialogTitle>
                    <DialogContent>{this.state.resultText}</DialogContent>
                    <DialogActions>
                        <DialogButton onClick={() => this.okImportCompleted()} isDefaultAction>Ok</DialogButton>
                    </DialogActions>
                </Dialog>
                {
                    this.state.synching ?
                        (<LinearProgress determinate={false} />) : null

                    /* style={{ Circular progress
                        position: 'relative',
                        left: '35vw',
                        bottom: '30vh'
                    }} */
                }
            </div>) : null
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const mapStateToProps = state=>{
    return {
        userData:state.userData,
        navigationState: state.navigationState,
        currentChatCommand: state.currentChatCommand,
        healthKitSyncDate: state.healthKitSyncDate,
        layoutHeight: state.layoutHeight
    };
}

const Signs = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignsComponent);

export default withRouter(Signs);