import APP_SETTINGS from '../constants/appSettings';
import moment from 'moment';

class ApiService{
    signUp(signUpData, callBack) {
        var dataToSend = JSON.stringify(signUpData);
        console.log(APP_SETTINGS.serverUrl);
        $.ajax({
            url: APP_SETTINGS.serverUrl + "signup",
            type: 'POST',
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: dataToSend
        }).done(function (result) {
            if (result.success) {
                callBack({success:true, data: result.data, error: undefined});
            }else {
                console.log(result);
                callBack({success:false, data: undefined, error: result.error});
            }
        }).fail(function () {
            callBack({success:false, data: undefined, error: "Signup error ocured! Please contact system administrator."});
        });
    }

    updatePushNotification(registrationId, token, callBack) {
        var dataToSend = JSON.stringify({"pnToken":registrationId});
        $.ajax({
            url: APP_SETTINGS.serverApiUrl + "push_subscriptions" + "?token=" + token,
            type: 'PUT',
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: dataToSend
        }).done(function (result) {
            if (result.success) {
                callBack({success:true, data: result.data, error: undefined});
            }else {
                console.log(result);
                callBack({success:false, data: undefined, error: result.error});
            }
        }).fail(function () {
            callBack({success:false, data: undefined, error: "Signup error ocured! Please contact system administrator."});
        });
    }

    signIn(signInData, callBack) {
        var dataToSend = JSON.stringify(signInData);
        console.log(APP_SETTINGS.serverUrl);
        $.ajax({
            url: APP_SETTINGS.serverUrl + "signin",
            type: 'POST',
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: dataToSend
        }).done(function (response) {
            if (response.success) {
                callBack({success:true, data: response.data, error: undefined});
            }else {
                console.log(response);
                callBack({success:false, data: undefined, error: response.error});
            }
        }).fail(function (error) {
            callBack({success:false, data: undefined, error: "Signup error ocured! Please contact system administrator."});
        });
    }

    getPatientVitalSigns(token, callBack) {
        var apiUrl = APP_SETTINGS.serverApiUrl + "events";
        $.ajax({
            url: apiUrl + '?token=' + token,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
        }).done(function (response) {
            if (response.success) {
                callBack(null, { success: true, data: response.result, error: undefined });
            }
            else {
                callBack(null, { success: false, data: undefined, error: "error" });
            }
        }).fail(function (error) {
            callBack(error, { success: false, data: undefined, error: "error" });
        });
    }

    getDetails(token, callBack) {
        var apiUrl = APP_SETTINGS.serverApiUrl + "patients";
        apiUrl = apiUrl + "/" + data.email;
        $.ajax({
            url: apiUrl + '?token=' + data.token,
            type: 'GET',
            crossDomain: true
        }).done(function (response) {
            if (response.success) {
                callBack(null, { success: true, data: response.result, error: undefined });
            }
            else {
                callBack(null, { success: false, data: undefined, error: "error" });
            }
        }).fail(function (error) {
            callBack(error, { success: false, data: undefined, error: "error" });
        });
    }
    
    sendMeasure(token, value, callBack) {

        /* let value = {
            deviceModelType:"BloodPressure",
            diastolic:145,
            systolic:110,
            dateTime:moment()
        } */

        var obj = {};
        switch (value.deviceModelType) {
            case "BloodOxygen":
                obj.bloodOxygen = value.spo2;
                //obj.heartRate = value.pr;
                obj.measurementType = "bloodOxygen";
                obj.measurementDateTime = moment(value.dateTime).utc().valueOf();
                break;
            case "Temperature":
                obj.temperature = value.temperature;
                obj.measurementType = "temperature";
                obj.measurementDateTime = moment(value.dateTime).utc().valueOf();
                break;
            case "HeartRate":
                obj.heartRate = value.heartRate;
                obj.measurementType = "heartRate";
                obj.measurementDateTime = moment(value.dateTime).utc().valueOf();
                break;
            case "Weight":
                obj.weight = value.value;
                obj.measurementType = "weight";
                obj.measurementDateTime = moment(value.dateTime).utc().valueOf();
                break;
            case "BloodPressure":
                obj.bloodPressure = {};
                obj.bloodPressure.diastolic = value.diastolic;
                obj.bloodPressure.systolic = value.systolic;
                obj.measurementType = "bloodPressure";
                obj.measurementDateTime = moment(value.dateTime).utc().valueOf();
                break;
        }
        var dataToSend = JSON.stringify(obj);
        var apiUrl = APP_SETTINGS.serverApiUrl + "events";
            $.ajax({
                url: apiUrl + '?token=' + token,
                type: 'POST',
                crossDomain: true,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: dataToSend
            }).done(function (response) {
                if (response.success) {
                    callBack(null, { success: true, data: { status: "measure-confirmed" }, error: undefined });
                }
                else {
                    callBack(null, { success: false, data: undefined, error: response.message });
                }
            }).fail(function (error) {
                callBack(error, { success: false, data: undefined, error: error });
            });
    }

    getEnrolment(email, callBack) {
        var apiUrl = APP_SETTINGS.enrolServerUrl + "EnrolPatient";
        apiUrl = apiUrl + "/" + email;
        $.ajax({
            url: apiUrl,
            type: 'GET',
            crossDomain: true
        }).done(function (response) {
                callBack(null, response);
        }).fail(function (error) {
            callBack(error, null);
        });
    }

    patientBookAnAppointment(token, slot, callBack) {
        var serverUrl = APP_SETTINGS.serverApiUrl;
        var apiUrl = serverUrl + "appointments";
        var symptomResultsJson = localStorage.getItem("symptomResult");
        var dataToSend = JSON.stringify(slot);
        $.ajax({
            url: apiUrl + '?token=' + token,
            type: 'PUT',
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: dataToSend
        }).done(function (result) {
            if (symptomResultsJson) {
                try {
                    var symptomResults = JSON.parse(symptomResultsJson);
                    if (symptomResults) {
                        symptomResults.symptomDateTime = moment().valueOf().toString();

                        var symptomResultToSend = { evidence: symptomResults };

                        $.ajax({
                            url: serverUrl + "symptoms/addPatientSymptoms" + '?token=' + token,
                            type: 'POST',
                            crossDomain: true,
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify(symptomResultToSend)
                        }).done(function (result) {
                            localStorage.setItem("symptomResult", undefined);
                        }).fail(function () {
                            localStorage.setItem("symptomResult", undefined);
                        });
                    }
                }
                catch (e) {

                }
            }
            callBack(null, result);
        }).fail(function (error) {
            callBack(error);
        });
    }

    getSlots(token, startDate, callBack) {
        var apiUrl = APP_SETTINGS.serverApiUrl + "slots";
        $.ajax({
            url: apiUrl + '?token=' + token,
            type: 'GET',
            crossDomain: true
        }).done(function (result) {
            callBack(null, result);
        }).fail(function (error) {
            callBack(error);
        });
    }

    getPatientAppointment(token, callBack) {
        var apiUrl = APP_SETTINGS.serverApiUrl + "patientAppointments";
        var req = {
            url: apiUrl + '?token=' + token,
            type: 'GET',
            crossDomain: true
        };

        $.ajax(req).done( (result) => {
            callBack(null, result);
        }).fail( (error) => {
            callBack(error);
        });
    }

    getProviderSlotById(token, slotId, callBack) {
        var apiUrl = Bridge.serverApiUrl + "slots/" + slotId;
        $.ajax({
            url: apiUrl + '?token=' + token,
            type: 'GET',
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
        }).done(function (result) {
            callBack(null, result);
        }).fail(function (error) {
            callBack(error);
        });
    }

    getProviderDetails(token, userId, callBack) {
        var apiUrl = APP_SETTINGS.serverApiUrl + "provider/?providerId=" + userId;
        $.ajax({
            url: apiUrl + '&token=' + token,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
        }).done(function (data) {
            if (data.success) {
                callBack(null, data.result);
            }
            else {
                callBack("error");
            }
        }).fail(function (error) {
            callBack(error);
        });
    }

    sendEvent(token, userId, event, retryInterval, callBack) {
        var apiUrl = APP_SETTINGS.enrolServerUrl + "patient_event/"+userId;
        $.ajax({
            url: apiUrl,
            type: "POST",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(event)
        }).done((data)=> {
            clearTimeout(this.timeoutHandler);
            if(callBack) callBack(null, data.result);
        }).fail((error)=> {
            this.timeoutHandler = setTimeout(()=>{
                this.sendEvent(token, userId, event, retryInterval * 2, callBack);
            }, retryInterval);
        });
    }

    getAction(token, userId, callBack) {
        var apiUrl = APP_SETTINGS.enrolServerUrl + "patient_action/"+userId;
        $.ajax({
            url: apiUrl,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done((data)=> {
            callBack(null, data);
        }).fail((error)=> {
            callBack(error);
        });
    }

    error(errorData) {
        window.alert("Invalid username or password. Please try again!")
        return;
        var success = function(message) {
            if (message == "Yes") {
                // Write Logout code.
            } else if (message == "No") {
                // Write your code.
            }
        }
        
        var failure = function() {
        }
 
        var alertJson = {}
        alertJson ["title"] = "Error";
        alertJson ["message"] = errorData.error;
        alertJson ["okButton"] = "Ok";
        //alertJson ["cancelButton"] = "No";
            if(window.nativealert)
                window.nativealert.showAlert(JSON.stringify(alertJson), success, failure); 
            else alert(alertJson ["message"]);
    }
}

const apiService = new ApiService();

export default apiService;