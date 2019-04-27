import React from 'react';
import $ from "jquery";
import moment from 'moment';
import 'fullcalendar/dist/fullcalendar.min.css'
import 'fullcalendar-scheduler/dist/scheduler.min.css'
import './styles/patient-appointments.css';
import fullcalendar from "fullcalendar";
import 'fullcalendar-scheduler';
import DatePicker from 'react-date-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import '../../mobiscroll.custom/css/mobiscroll.react.min.css';
import './styles/component.css';
import mobiscroll from '../../mobiscroll.custom/js/mobiscroll.react.min';
import { Route, Redirect, withRouter } from 'react-router-dom';

import { Typography } from '@rmwc/Typography';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
  } from '@rmwc/dialog';


import { TextField, TextFieldIcon, TextFieldHelperText } from '@rmwc/TextField';
import { Fab } from '@rmwc/Fab';
import apiService from '../../model/apiService';
import calendarFactory from '../../model/calendarFactory';
import doctorImg from './images/doctor.png'

class DateSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            open: false
          };
    }

    setDate(date){
        this.setState({
            date: date
          });
    }

    render() {
        return this.state.open?(<div>
        <DatePicker
          onChange={this.onChange}
          value={this.state.date}
        />
        </div>):null;
    }
}

class AppointmentsComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            openDialog: false,
            openSymptomateDialog: false,
            slotId: undefined,
            isSnackbarActive: false,
            snackbarTimeOut: 10000
        }
        this.onDayChange = this.onDayChange.bind(this);
        this.onEventSelect = this.onEventSelect.bind(this);
        this.onReasonChange = this.onReasonChange.bind(this);
        this.handleSkipSymptomCheckerSuggestion=this.handleSkipSymptomCheckerSuggestion.bind(this);
        this.handleSymptomCheckerSuggestion = this.handleSymptomCheckerSuggestion.bind(this);
        this.handleBookAppointment = this.handleBookAppointment.bind(this);
        this.handleCancelAppointmentModal = this.handleCancelAppointmentModal.bind(this);
        this.onCallClick = this.onCallClick.bind(this);
        this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
        this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);

        this.stopCall = this.stopCall.bind(this);

        if(window.Media){
              this.my_media = new Media('img/skype_call.mp3',
                // success callback
                function () { 
                  console.log("playAudio():Audio Success"); 
              },
                // error callback
                function (err) { console.log("playAudio():Audio Error: " + JSON.stringify(err)); }
              );
        }
    }

    handleSymptomCheckerSuggestion() {
        this.setState({goCheckSymptoms:true});
    }

    handleSkipSymptomCheckerSuggestion() {
        this.setState({ openDialog: true, openSymptomateDialog: false });
    }

    handleBookAppointment() {
        var slotId = this.state.slotId;
        var reasonText = this.state.reasonText;

        var slotDateTime = moment(slotId);
        var now = new Date();
        var component = this;
        if (slotId <= now.getTime()) {
            this.setState({ reasonText: "" });
            this.setState({ openDialog: false, slotId: undefined });
            return;
        }
        else {
            apiService.patientBookAnAppointment(this.props.userData.token, {
                cancel: false,
                slotDateTime: slotId,
                appointmentReason: reasonText
            }, (error, result) => {
                var event = calendarFactory.getEventById(slotId, this.state.events);
                event.date = slotId;
                this.setState({ reasonText:'',openDialog: false, slotId: undefined });
                this.onDayChange(event);
            });
        }
    }

    handleCancelAppointmentModal() {
        this.setState({ reasonText:'', openDialog: false, slotId: undefined });
        return;
    }

    isToday(td) {
        var d = new Date();
        return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
    }
    componentDidUpdate() {
    }

    componentDidMount() {
        
        this.onDayChange({date:moment()});
        window.addEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.addEventListener('keyboardDidHide', this.onKeyboardDidHide);
    }

    componentWillUnmount(){
        window.removeEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.removeEventListener('keyboardDidHide', this.onKeyboardDidHide);
    }

    onKeyboardDidShow(){
        if(this.state.openDialog){
            this.setState({openDialogStyle:{top: '40vh !important'}, openDialogClassName:'keyboard-did-show'});
        }
    }

    onKeyboardDidHide(){
        this.setState({openDialogStyle:null, openDialogClassName:null});
    }

    onDayChange(event){
        let start = moment(event.date).startOf('day');
        let end = moment(event.date).endOf('day');
        apiService.getSlots(this.props.userData.token, moment().format("MM/DD"), (error, slotsResult) => {
            if (error) return;
            apiService.getPatientAppointment(this.props.userData.token, (error, appointmentsResult) => {
                if (error) return;
                let events = [];
                for (var i = 0; i < slotsResult.length; i++) {
                    if (slotsResult[i].slotDateTime >= start.valueOf() && slotsResult[i].slotDateTime < end.valueOf()) {
                        var event = calendarFactory.getEvent(slotsResult[i], appointmentsResult);

                        events.push(event);
                    }
                }
                this.setState({events:events});
                //callback(events);

                /* if (slotId && slotId.slotId) {
                    var slotDate = moment(parseFloat(slotId.slotId));
                    if (start <= slotDate && slotDate <= end) {
                        var event = calendarFactory.getEventById(parseFloat(slotId.slotId), events);
                        if (event && event.status != "appointment") {
                            setTimeout( () => {
                                component.setState({ openDialog: true, openSymptomateDialog: false, slotId: parseFloat(slotId.slotId), slotReason: "" });
                            }, 500);
                        }
                    }
                }
                else {
                    component.setState({ isSnackbarActive: true });
                } */

            })
        });
    }

    onEventSelect(event){
        if(event.event.countOfProviders>0){
            this.setState({openSymptomateDialog:true, slotId:event.event.slotId});
        }
    }

    onReasonChange(event){
        this.setState({ reasonText: event.target.value });
    }

    onCallClick(){
        this.setState({ callDialog: true });
        if(this.my_media)
        this.my_media.play();
        setTimeout(()=>{
            this.stopCall();
            if(window.CDV.ZoomPlugin){
                window.CDV.ZoomPlugin.joinMeeting('9194547223','Patient',()=>{
                    console.log("We are in the meeting");
                },
                (err)=>{

                });
            }
        },8000);
    }

    stopCall(){
        this.setState({ callDialog: false });
        if(this.my_media)
        this.my_media.stop();
    }

    render() {
        return this.state.goCheckSymptoms? (<Redirect to='/stage/symptoms'/>): (<div>
            <div>
                <div style={{ height: '78vh', overflowY: 'scroll' }}>
                <mobiscroll.Eventcalendar
                lang="en-UK"
                theme="ios"
                display="inline"
                data = {this.state.events}
                view={{
                    calendar: { type: 'week' },
                    eventList: { type: 'day' }
                }}
                onDayChange={this.onDayChange}
                onEventSelect={this.onEventSelect}
                />
                    <Fab style={{ position: 'fixed', bottom: '15vh', right: '5vh' }} icon='phone'
                        onClick={() => {
                            this.onCallClick();
                        }}
                    ></Fab>
                    <Dialog open={this.state.openSymptomateDialog}>
                        <DialogTitle>Symptoms</DialogTitle>
                        <DialogContent>Do you have any symptoms?</DialogContent>
                        <DialogActions>
                            <DialogButton onClick={this.handleSymptomCheckerSuggestion}>Yes</DialogButton>
                            <DialogButton onClick={this.handleSkipSymptomCheckerSuggestion} isDefaultAction>Skip</DialogButton>
                        </DialogActions>
                    </Dialog>
                    <div style={this.state.openDialogStyle}>
                    <Dialog className={this.state.openDialogClassName} open={this.state.openDialog}>
                        <DialogTitle>Book an appointment</DialogTitle>
                        <DialogContent>
                            <TextField textarea fullwidth rows="3" id="reasonText" name="reasonText" onChange={this.onReasonChange} label="Reason" onChange={this.onReasonChange} />
                        </DialogContent>
                        <DialogActions>
                            <DialogButton onClick={this.handleBookAppointment}>Submit</DialogButton>
                            <DialogButton onClick={this.handleCancelAppointmentModal}>Close</DialogButton>
                        </DialogActions>
                    </Dialog>
                    </div>
                    <Dialog open={this.state.callDialog}>
                        <DialogTitle>Call</DialogTitle>
                        <DialogContent>
                            <img src={doctorImg} style={{width:'65vw', height:'30vh'}} />
                                <div>
                                    <Typography style={{display: 'block', marginBottom: '10px', marginLeft: 'auto',marginRight: 'auto', width:'50%'}} use="body1" tag="div" theme="text-secondary-on-background">Dr. Martin Who</Typography>
                                </div>
                                <div>
                                    <Fab  style={{display: 'block',marginLeft: 'auto',marginRight: 'auto'}} icon='call_end' onClick={this.stopCall} />
                                </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>);
    }
}


const mapStateToProps = state => {
    return { userData: state.userData, voiceState: state.voiceState};
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const Appointments = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppointmentsComponent);

export default Appointments;