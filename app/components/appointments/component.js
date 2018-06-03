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

import { Button, ButtonIcon } from 'rmwc/Button';
import {
    Card,
    CardPrimaryAction,
    CardMedia,
    CardAction,
    CardActions,
    CardActionButtons,
    CardActionIcons
} from 'rmwc/Card';

import { LinearProgress } from 'rmwc/LinearProgress';
import { Radio } from 'rmwc/Radio';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryText,
    ListItemGraphic,
    ListItemMeta,
    ListDivider
} from 'rmwc/List';

import { Grid, GridCell } from 'rmwc/Grid';
import { Checkbox } from 'rmwc/Checkbox';
import { Typography } from 'rmwc/Typography';
import {
    Dialog,
    DefaultDialogTemplate,
    DialogSurface,
    DialogHeader,
    DialogHeaderTitle,
    DialogBody,
    DialogFooter,
    DialogFooterButton,
    DialogBackdrop
  } from 'rmwc/Dialog';

import { Snackbar } from 'rmwc/Snackbar';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';
import { Fab } from 'rmwc/Fab';
import apiService from '../../model/apiService';
import calendarFactory from '../../model/calendarFactory';

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
        this.jq = $.noConflict();
    }
    handleSymptomCheckerSuggestion() {
        var slotId = this.state.slotId;
        Bridge.Redirect.redirectToWithLevelsUp("profile/patient-symptomate.html?slotId=" + slotId, 2);
    }

    handleSkipSymptomCheckerSuggestion() {
        this.setState({ openDialog: true, openSymptomateDialog: false });
    }

    handleBookAppointment() {
        var appointmentsCalendarDiv = this.jq(this.appointmentsCalendar);
        var slotId = this.state.slotId;
        var reasonText = this.jq("#reasonText").val();

        var slotDateTime = moment(slotId);
        var now = new Date();
        var component = this;
        if (slotDateTime <= now.getTime()) {
            this.jq("#reasonText").val("");
            component.setState({ openDialog: false, slotId: undefined });
            return;
        }
        else {
            apiService.patientBookAnAppointment(this.props.userData.token, {
                cancel: false,
                slotDateTime: slotId,
                appointmentReason: reasonText
            }, (error, result) => {
                var event = calendarFactory.getEventById(slotId, appointmentsCalendarDiv.fullCalendar("clientEvents"));
                if (event) {
                    appointmentsCalendarDiv.fullCalendar("updateEvent", calendarFactory.getBookedEvent(event, result));
                }

                this.jq("#reasonText").val("");
                component.setState({ openDialog: false, slotId: undefined });
                return;
            });
        }
    }
    handleCancelAppointmentModal() {
        this.setState({ openDialog: false, slotId: undefined });
        this.jq("#reasonText").val("");

        var actualHeight = this.jq(".fc-scroller").height();
        this.jq(".fc-scroller").height(actualHeight + 1);
        this.jq(".fc-scroller").height(actualHeight - 1);

        return;
    }
    onDateChanged(valueText, inst) {
        var date = moment(valueText);
        this.jq(this.appointmentsCalendar).fullCalendar("gotoDate", date);
    }
    isToday(td) {
        var d = new Date();
        return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
    }
    componentDidUpdate() {
    }

    componentDidMount() {
        var component = this;

        this.jq(component.appointmentsCalendar).on("swipeleft", (event) => {
            this.jq(component.appointmentsCalendar).fullCalendar("next");
        });

        this.jq(component.appointmentsCalendar).on("swiperight", (event) => {
            var defDate = this.jq(component.appointmentsCalendar).fullCalendar("getDate")._d;
            if (component.isToday(defDate)) { return; }
            this.jq(component.appointmentsCalendar).fullCalendar("prev");
        });

        var slotId = this.props.slotId;

        var currentDate = slotId && slotId.slotId ? new Date(parseFloat(slotId.slotId)) : new Date();
        this.jq('#appointmentsCalendar').fullCalendar({
            schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
            defaultView: 'nursesGrid',
            defaultTimedEventDuration: '00:15:00',
            allDaySlot: false,
            header: false,
            height: this.jq(this.appointmentsCalendarWrapper).height() - 8,
            allDay: false,
            defaultDate: currentDate,
            views: {
                nursesGrid: {
                    type: 'agenda',
                    duration: { days: 1 },
                    slotDuration: '00:15',
                    slotLabelInterval: '00:15',
                    columnFormat: 'dddd MM / DD'
                }
            },
            scrollTime: currentDate.getHours() + ':' + currentDate.getMinutes() + ':00',
            eventClick: (calEvent, jsEvent, view)=> {
                var now = new Date();
                if (calEvent.id < now.getTime()) {
                    return;
                }

                if (calEvent.status == "appointment") {
                    Bridge.Redirect.redirectToWithLevelsUp("profile/appointment-details.html?slotId=" + calEvent.id, 2);
                    return;
                }

                if (calEvent.slot.countOfProviders == 0) {
                    return;
                }

                if (view.name == 'nursesGrid') {
                    setTimeout( () => {
                        this.jq('.fc-scroller').animate({
                            scrollTop: jsEvent.currentTarget.offsetTop
                        }, 300,  () => {
                            component.setState({ openDialog: false, openSymptomateDialog: true, slotId: calEvent.id, slotReason: "" });
                        });
                    }, 0);
                }
            },
            events: (start, end, timezone, callback) => {
                var events = [];
                apiService.getSlots(this.props.userData.token, start.format("MM/DD"), (error, slotsResult) => {
                    if (error) return;
                    apiService.getPatientAppointment(this.props.userData.token, (error, appointmentsResult) => {
                        if (error) return;
                        for (var i = 0; i < slotsResult.length; i++) {
                            if (slotsResult[i].slotDateTime >= start.valueOf() && slotsResult[i].slotDateTime < end.valueOf()) {
                                var event = calendarFactory.getEvent(slotsResult[i], appointmentsResult);

                                events.push(event);
                            }
                        }
                        callback(events);

                        if (slotId && slotId.slotId) {
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
                        }

                    })
                });

                component["dateSelector"].setDate(start._d);
            },
            eventAfterAllRender: (view) => {
            },
            loading: (isLoading, view) => {
            }
        });
    }
    onReasonChange() {
    }

    render() {
        return <div>
            <div>
                <div style={{height:'85vh', overflowY:'scroll'}} ref={appointmentsCalendarWrapper => this.appointmentsCalendarWrapper = appointmentsCalendarWrapper}>
                    <div id='appointmentsCalendar' ref={appointmentsCalendar => this.appointmentsCalendar = appointmentsCalendar}></div>
                    <Dialog ref={suggestSymptomateModal => this.suggestSymptomateModal = suggestSymptomateModal} id="appointmentModal" open={this.state.openSymptomateDialog}>
                        <DialogSurface>
                            <DialogHeader>
                                <DialogHeaderTitle>Symptoms</DialogHeaderTitle>
                            </DialogHeader>
                            <DialogBody>Do you have any symptoms?</DialogBody>
                            <DialogFooter>
                                <DialogFooterButton onClick={this.handleSymptomCheckerSuggestion}>Yes</DialogFooterButton >
                                <DialogFooterButton onClick={this.handleSkipSymptomCheckerSuggestion}>Skip</DialogFooterButton>
                            </DialogFooter>
                        </DialogSurface>
                    </Dialog>
                    <Dialog ref={appointmentModal => this.appointmentModal = appointmentModal} id="appointmentModal" open={this.state.openDialog}>
                        <DialogSurface>
                            <DialogHeader>
                                <DialogHeaderTitle>Book an appointment</DialogHeaderTitle>
                            </DialogHeader>
                            <DialogBody>
                                <TextField textarea fullwidth rows="3" id="reasonText" name="reasonText" ref={reasonText => this.reasonText = reasonText} label="Reason" onChange={this.onReasonChange} />
                            </DialogBody>
                            <DialogFooter>
                                <DialogFooterButton onClick={this.handleBookAppointment}>Submit</DialogFooterButton >
                                <DialogFooterButton onClick={this.handleCancelAppointmentModal}>Close</DialogFooterButton>
                            </DialogFooter>
                        </DialogSurface>
                    </Dialog>
                    <DateSelector ref={dateSelector => this.dateSelector = dateSelector} onSelectDateCallback={this.onDateChanged} />
                </div>
            </div>
        </div>
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