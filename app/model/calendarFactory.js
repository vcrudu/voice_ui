import moment from "moment";

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
            slotId: slotData.slotDateTime,
            start: moment(slotData.slotDateTime),
            end: moment(slotData.slotDateTime).add(15,'m'),
            text: slotData.countOfProviders + (slotData.countOfProviders>1?" doctors are":" doctor is")+" available.",
            countOfProviders:slotData.countOfProviders
        };
        switch(eventType){
            case 'noProvider':
                break;
            case 'available':                
                break;
            case 'appointment':
                event.background =  '#ffa000';
                event.color =  '#ffa000';
                event.text = " You have booked the appointment at this time. " + matchedSlot.providerName + " will be with you. Please be online!";
                event.status = "appointment";
                break;
        }

        return event;
    }

    getEventById(eventId, events) {
        for(var i=0; i<events.length; i++) {
            if (events[i].slotId === eventId) {
                return events[i];
            }
        }
        return undefined;
    }
}

const calendarFactory = new CalendarFactory();

export default calendarFactory;