/**
 * Created by Victor on 2/25/2016.
 */

(function() {
    "use strict";

    var Layout = ReactMDL.Layout;
    var Content = ReactMDL.Content;
    var FABButton = ReactMDL.FABButton;
    var Icon = ReactMDL.Icon;
    var ProgressBar  = ReactMDL.ProgressBar;

    var TimeSelector = React.createClass({
        handleShow: function() {
                var changeTimePicker = $(this.refs.changeTimePicker);
                var inst = changeTimePicker.mobiscroll('getInst');
                if (changeTimePicker && changeTimePicker.length > 0){
                    inst.haveRange=null;
                    inst.show();

                }
            return false;
        },
        componentDidMount: function() {
            var changeTimePicker = $(this.refs.changeTimePicker);
            var component = this;
            var initRange1=new Date(new Date().setHours(8));
            var initRange2=new Date(new Date().setHours(17));
            changeTimePicker.mobiscroll().range({
                theme: "material",
                display: "bottom",
                controls: ['time'],
                timeFormat:'HH',
                defaultValue: [initRange1,initRange2],
                steps: {
                    minute: 60,
                    zeroBased: true
                },
                onSelect: function (valueText, inst) {
                    component.props.onSelectTimeCallback(valueText, inst);
                },
                maxWidth: 100,
                onBeforeShow:function(inst){
                    if(inst.haveRange) {
                        var first=inst.haveRange.intervals.split(':');
                        var start=new Date(new Date().setHours(first[0],0,0,0));
                        var second=first[1].split('-');
                        var end=new Date(new Date().setHours(second[1],0,0,0));
                        inst.setVal([start, end]);
                    }else{
                        inst.setVal([initRange1,initRange2]);
                    }
                },

            });
        },
        render: function() {
            return <div className="show-avaialbility-mobiscroll-wrapper">
                <input id="changeTimePicker" ref="changeTimePicker" className="hide"/>
                <FABButton colored ripple className="show-availability-mobiscroll" onClick={this.handleShow}>
                    <Icon name="add" />
                </FABButton>
            </div>
        }
    });



    var ProviderAvailabilityCalendar = React.createClass({

        getTodayAvailability: function(date) {
            var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
            var todayEvents = $(this.refs.availabilityCalendar).fullCalendar('clientEvents', function (anEvent) {
                if (anEvent.start && anEvent.start.toDate() >= startDate
                    && anEvent.start.toDate() <= endDate) {
                    return true
                }
            });

            if(todayEvents.length==0) return null;

            var availabilityString = '';

            _.forEach(todayEvents, function (todayEvent) {
                availabilityString += todayEvent.title + ',';
            });

            availabilityString = availabilityString.substring(0,availabilityString.length-1);
            return availabilityString;
        },
        onTimeChanged: function(valueText, inst) {
            var availabilityCalendarDiv = $(this.refs.availabilityCalendar);
            var dateString = moment(availabilityCalendarDiv.fullCalendar("getDate")).format("DD[.]MM[.]YYYY");
            var inputTimeRange=valueText.split(" ");
            var availabilityString=inputTimeRange[0]+':00-'+inputTimeRange[2]+':00';
            if(!inst.haveRange) {
                Bridge.Provider.providerSetAvailability({
                    availabilityString: availabilityString,
                    dateString: dateString
                }, function (result) {
                    availabilityCalendarDiv.fullCalendar("refetchEvents");
                });
            } else {
                var oldAvailability=inst.haveRange.intervals;
                Bridge.Provider.providerUpdateAvailability({
                    availabilityString: availabilityString,
                    dateString: dateString,
                    oldAvailabilityString: oldAvailability
                }, function(result) {
                    availabilityCalendarDiv.fullCalendar('refetchEvents' );

                });
            }

        },
        isToday: function (td){
            var d = new Date();
            return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
        },
        componentDidMount: function() {
            var component = this;

            $(component.refs.availabilityCalendar).on("swipeleft" , function(event) {
                $(component.refs.availabilityCalendar).fullCalendar("next");
            });

            $(component.refs.availabilityCalendar).on("swiperight", function(event) {
                var defDate = $(component.refs.availabilityCalendar).fullCalendar("getDate")._d;
                if (component.isToday(defDate)) {return;}
                $(component.refs.availabilityCalendar).fullCalendar("prev");
            });

            var currentDate = new Date();
            $(this.refs.availabilityCalendar).fullCalendar({
                schedulerLicenseKey: '0220103998-fcs-1447110034',
                defaultView: 'nursesGrid',
                defaultTimedEventDuration: '01:00:00',
                allDaySlot: false,
                height: $(window).height() - 4,
                header:false,
                allDay:false,
                views: {
                    nursesGrid: {
                        type: 'agenda',
                        duration: {days: 1},
                        slotDuration: '01:00',
                        slotLabelInterval: '01:00'
                    }
                },
                scrollTime: currentDate.getHours() + ':' + currentDate.getMinutes() + ':00',
                eventClick: function (calEvent, jsEvent, view) {

                    var range = calEvent.availability;
                    var timeSelector = component.refs.timeSelector;
                    if (timeSelector) {
                        var changeTimePicker = $(timeSelector.refs.changeTimePicker);
                        var inst = $(timeSelector.refs.changeTimePicker).mobiscroll('getInst');
                        if (changeTimePicker && changeTimePicker.length > 0){
                            inst.haveRange=range;
                            inst.show();

                        }
                    }


                },

                events: function (start, end, timezone, callback) {
                    $(".mdl-progress").css('visibility', 'visible');
                    var events = [];
                    Bridge.Provider.getProviderSlots(start,end,function (result) {
                        if (result.success) {
                            for (var i = 0; i < result.data.length; i++) {
                                var intervals = result.data[i].intervals.split("-");
                                events.push({
                                    availability: result.data[i],
                                    title: result.data[i].intervals,
                                    start: intervals[0]+':00',
                                    end: intervals[1]+':00',
                                    allDay:true,
                                    icon: 'fa fa-calendar',
                                    className: ["event", 'bg-color-' + 'greenLight'],
                                    backgroundColor: '#9575CD'
                                });
                            }

                            callback(events);

                            $(".mdl-progress").css('visibility', 'hidden');
                        }
                    });

        },
                eventRender: function(event, element) {
                    element.find('.fc-event-title').append("<br/>" + event.location);
                    element.find('.fc-time').hide();
                },
                eventAfterAllRender: function (view) {
                },
                resources: [
                    {id: 'a', title: 'Availability'}
                ]
            });
        },
        render: function() {
            return <Layout>
                <Content>
                    <ProgressBar indeterminate ref="progressBar" id="progressBar"/>
                    <div ref="appointmentsCalendarWrapper">
                        <div ref="availabilityCalendar" id="calendar"></div>

                        <TimeSelector ref="timeSelector" onSelectTimeCallback={this.onTimeChanged}/>
                    </div>
                </Content>
            </Layout>
        }
    });

    ReactDOM.render(<ProviderAvailabilityCalendar />, document.getElementById("provider-availability"));
})();