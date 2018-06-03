class CalendarFactory {
    getCurrentTimeString(dateTime) {
        var hours = dateTime.getHours();
        if (hours < 10)hours = '0' + hours;
        var minutes = dateTime.getMinutes();
        if (minutes < 10)minutes = '0' + minutes;
        var seconds = dateTime.getSeconds();
        if (seconds < 10)seconds = '0' + seconds;
        return hours + ':' + minutes + ':' + seconds;
    }

    getEvent(slotData, patientData){
        var matchedSlot = patientData.result.find((slot)=>{
            return slotData.slotDateTime === slot.slotDateTime;
        });

        var eventType;
        if(matchedSlot) {
            eventType = 'appointment';
        }else if(slotData.countOfProviders > 0){
            eventType = 'available';
        }else {
            eventType = 'noProvider';
        }

        var dateTime = new Date();
        dateTime.setTime(slotData.slotDateTime);
        var event = {
            id: slotData.slotDateTime,
            title: slotData.countOfProviders + " doctors are available.",
            titleText: " doctors are available.",
            slot: slotData,
            start: this.getCurrentTimeString(dateTime),
            icon: 'fa fa-calendar',
            borderColor: '#ffffff',
            displayEventTime: false,
            allDay:false
        };
        switch(eventType){
            case 'noProvider':
                event.backgroundColor = '#ffffff';
                event.textColor = 'rgb(255,82,82)';
                event.status = "noProvider";
                return event;
                break;
            case 'available':
                event.backgroundColor = '#ffffff';
                event.textColor = 'rgb(100,221,23)';
                event.status = "available";
                return event;
                break;
            case 'appointment':
                event.backgroundColor = '#ffffff';
                event.textColor = 'rgb(0,176,255)';
                event.title = " You have booked the appointment at this time. " + matchedSlot.providerName + " will be with you. Please be online!";
                event.status = "appointment";
                return event;
                break;
        }
    }

    getBookedEvent(event, provider) {
        var dateTime = new Date();
        dateTime.setTime(event.id);

        if (event.countOfProviders > 0) {
            event.countOfProviders -= 1;
        }

        event.title = "You have booked the appointment at this time. " + provider.result.title + " " + provider.result.name + " " + provider.result.surname + " will be with you. Please be online!";
        event.backgroundColor = 'rgb(245,245,245)';
        event.textColor = 'rgb(0,176,255)';
        event.titleText = "";
        event.status = "appointment";

        return event;
    }

    getEventById(eventId, events) {
        for(var i=0; i<events.length; i++) {
            if (events[i].id === eventId) {
                return events[i];
            }
        }
        return undefined;
    }
}

const calendarFactory = new CalendarFactory();

export default calendarFactory;