/**
 * Created by Victor on 2/22/2016.
 */

var is_keyboard = false;
var is_landscape = false;
var initial_screen_size = window.innerHeight;

function getFakeUser(callback) {
    $.getJSON("../resources/json/vcrudu.json").then(function (data) {
        callback(data);
    });
}

function getFakeWhoProvider(callback) {
    $.getJSON("../resources/json/who.json").then(function (data) {
        callback(data);
    });
}

function getFakeProvider(callback) {
    $.getJSON("../resources/json/vlad.json").then(function (data) {
        callback(data);
    });
}

var Bridge = {};

//Bridge.serverUrl = "http://localhost:8081/";
//Bridge.serverApiUrl = "http://localhost:8081/v1/api/";

//Bridge.serverUrl = "http://192.168.0.12:8081/";
//Bridge.serverApiUrl = "http://192.168.0.12:8081/v1/api/";

Bridge.serverUrl = "https://app.trichromehealth.com/";
Bridge.serverApiUrl = "https://app.trichromehealth.com/v1/api/";

Bridge.Redirect = {
    getQueryStringParam: function(key) {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    redirectToPatientSignUp: function() {
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"redirectToPatientSignUp"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            window.location.href = "/signup/patient-signup.html"
        }
    },
    redirectToProviderSignUp: function() {
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"redirectToProviderSignUp"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            window.location.href = "/signup/provider-signup.html"
        }
    },
    redirectToSignIn: function(email){
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"redirectToSignIn", data: {email:email}};
            prompt("bridge_key", JSON.stringify(message));
        } else {

        }
    },
    redirectTo: function(url){
        var paths = window.location.pathname.split("/");
        var pathToRedirect = "";
        if (paths.length > 0) {
            for (var i=0;i<paths.length -1; i++) {
                if (paths[i] != "") {
                    pathToRedirect += "/" + paths[i];
                }
            }
        }
        pathToRedirect += "/" + url;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"redirectTo", data: {url:pathToRedirect}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            window.location.href=pathToRedirect;
        }
    },
    redirectToWithLevelsUp: function(url, levelUp){
        var paths = window.location.pathname.split("/");
        var pathToRedirect = "";
        if (paths.length > 0) {
            for (var i=0;i<paths.length - levelUp; i++) {
                if (paths[i] != "") {
                    pathToRedirect += "/" + paths[i];
                }
            }
        }
        pathToRedirect += "/" + url;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"redirectTo", data: {url:pathToRedirect}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            window.location.href=pathToRedirect;
        }
    },
    openUrl: function(url){
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Redirect.openUrl", data: {url:url}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var serverUrl = Bridge.serverUrl;
            getFakeUser(function (data) {
                serverUrl = serverUrl + "?token=" + data.token + url;
                window.open(serverUrl);
            });
        }
    },
    exitFromApplication: function() {
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"exitFromApplication"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            window.location.href = "/landing/landing.html"
        }
    }
};

Bridge.error = function(errorData, callBack) {
    Bridge.resultCallback = callBack;
    if ((/android/gi).test(navigator.userAgent)) {
        var message = {method:"error", data: errorData};
        prompt("bridge_key", JSON.stringify(message));
    }
}

Bridge.signUp = function(signUpData, callBack) {
    Bridge.resultCallback = callBack;
    if ((/android/gi).test(navigator.userAgent)) {
        var message = {method:"patientSignUp", data: signUpData};
        prompt("bridge_key", JSON.stringify(message));
    } else {
        var dataToSend = JSON.stringify(signUpData);
        $.ajax({
            url: this.serverUrl + "signup",
            type: 'POST',
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: dataToSend
        }).done(function (result) {
            if (result.success) {
                Bridge.resultCallback({success:true, data: result.data, error: undefined});
            }else {
                console.log(result.error);
                Bridge.resultCallback({success:false, data: undefined, error: result.error});
            }
        }).fail(function () {
            Bridge.resultCallback({success:false, data: undefined, error: "Signup error ocured! Please contact system administrator."});
        });
    }
}

Bridge.providerSignUp = function(signUpData, callBack) {
    Bridge.resultCallback = callBack;
    if ((/android/gi).test(navigator.userAgent)) {
        var message = {method:"providerSignUp", data: signUpData};
        prompt("bridge_key", JSON.stringify(message));
    } else {
        var dataToSend = JSON.stringify(signUpData);
        $.ajax({
            url: this.serverUrl + "signup",
            type: 'POST',
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: dataToSend
        }).done(function (result) {
            if (result.success) {
                console.log('s-a inscris');
                Bridge.resultCallback({success:true, data: result.data, error: undefined});
            }else {
                console.log(result.error);
                Bridge.resultCallback({success:false, data: undefined, error: result.error});
            }
        }).fail(function () {
            Bridge.resultCallback({success:false, data: undefined, error: "Signup error ocured! Please contact system administrator."});
        });
    }
}

Bridge.getSlots = function(startDate, callBack) {
    Bridge.resultCallback = callBack;
    if ((/android/gi).test(navigator.userAgent)) {
        var message = {method:"getSlots", data: startDate};
        prompt("bridge_key", JSON.stringify(message));
    } else {
        var apiUrl = this.serverApiUrl + "slots";
        getFakeUser(function (data) {
            $.ajax({
                url: apiUrl + '?token=' + data.token,
                type: 'GET',
                crossDomain: true
            }).done(function(result) {
                Bridge.resultCallback({success:true, data: result, error: undefined});
            }).fail(function() {
                Bridge.resultCallback({success:false, data: undefined, error: "error"});
            });
        });
    }
}

Bridge.getPatientAppointment = function(callBack) {
    Bridge.resultCallback = callBack;
    if ((/android/gi).test(navigator.userAgent)) {
        var message = {method:"getPatientAppointment"};
        prompt("bridge_key", JSON.stringify(message));
    } else {
        var apiUrl = this.serverApiUrl + "patientAppointments";
        getFakeUser(function (data) {

            var req = {
                url: apiUrl + '?token=' + data.token,
                type: 'GET',
                crossDomain: true
            };

            $.ajax(req).done(function(result) {
                Bridge.resultCallback({success:true, data: result, error: undefined});
            }).fail(function() {
                Bridge.resultCallback({success:false, data: undefined, error: "error"});
            });
        });
    }
}

Bridge.patientBookAnAppointment = function(slot, callBack) {
    Bridge.resultCallback = callBack;
    if ((/android/gi).test(navigator.userAgent)) {
        var message = {method:"patientBookAnAppointment", data: slot};
        prompt("bridge_key", JSON.stringify(message));
    } else {
        var serverUrl = this.serverApiUrl;
        var apiUrl = serverUrl + "appointments";
        getFakeUser(function (data) {
            var symptomResultsJson = localStorage.getItem("symptomResult");
            var dataToSend = JSON.stringify(slot);
            $.ajax({
                url: apiUrl + '?token=' + data.token,
                type: 'PUT',
                crossDomain: true,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: dataToSend
            }).done(function (result) {
                if (symptomResultsJson) {
                    try{
                        var symptomResults = JSON.parse(symptomResultsJson);
                        if (symptomResults) {
                            symptomResults.symptomDateTime = moment().valueOf().toString();

                            var symptomResultToSend = {evidence: symptomResults};

                            $.ajax({
                                url: serverUrl + "symptoms/addPatientSymptoms" + '?token=' + data.token,
                                type: 'POST',
                                crossDomain: true,
                                dataType: "json",
                                contentType: "application/json; charset=utf-8",
                                data: JSON.stringify(symptomResultToSend)
                            }).done(function(result) {
                                localStorage.setItem("symptomResult", undefined);
                            }).fail(function() {
                                localStorage.setItem("symptomResult", undefined);
                            });
                        }
                    }
                    catch(e) {

                    }
                }
                Bridge.resultCallback({success: true, data: result, error: undefined});
            }).fail(function () {
                Bridge.resultCallback({success: false, data: undefined, error: "error"});
            });
        });
    }
}

Bridge.getPatientVitalSigns = function(callBack) {
    Bridge.resultCallback = callBack;
    if ((/android/gi).test(navigator.userAgent)) {
        var message = {method:"getPatientVitalSigns"};
        prompt("bridge_key", JSON.stringify(message));
    } else {
        var apiUrl = this.serverApiUrl + "events";
        getFakeUser(function (data) {
            $.ajax({
                url: apiUrl + '?token=' + data.token,
                type: "GET",
                crossDomain: true,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
            }).done(function (result) {
                if (result.success) {
                    Bridge.resultCallback({success: true, data: result.result, error: undefined});
                }
                else {
                    Bridge.resultCallback({success: false, data: undefined, error: "error"});
                }
            }).fail(function () {
                Bridge.resultCallback({success: false, data: undefined, error: "error"});
            });
        });
    }
}

Bridge.getPatientDevices = function(callBack){
    Bridge.resultCallback = callBack;
    if ((/android/gi).test(navigator.userAgent)) {
        var message = {method:"getPatientDevices"};
        prompt("bridge_key", JSON.stringify(message));
    } else {
        var apiUrl = this.serverApiUrl + "devices";
        getFakeUser(function (data) {
            $.ajax({
                url: apiUrl + '?token=' + data.token,
                type: "GET",
                crossDomain: true,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
            }).done(function (result) {
                if (result.success) {
                    Bridge.resultCallback({success: true, data: result.items, error: undefined});
                }
                else {
                    Bridge.resultCallback({success: false, data: undefined, error: "error"});
                }
            }).fail(function () {
                Bridge.resultCallback({success: false, data: undefined, error: "error"});
            });
        });
    }
}

Bridge.callBack = function(result){
    if(result.data) {
        switch (result.data.method) {
            case "sendNotification": {
                if (Bridge.notificationCallback) {
                    Bridge.notificationCallback(result.data);
                } else {
                    if(!Bridge.resultCallback)
                        return;
                }
                break;
            }
            case "deleteNotifications": {
                if (Bridge.deleteNotificationsCallback) {
                    Bridge.deleteNotificationsCallback(result.data.notifications);
                } else {
                    if(!Bridge.deleteNotificationsCallback)
                        return;
                }
                break;
            }
        }
    }

    if(Bridge.resultCallback){
        if(result && Bridge.resultCallback){
            Bridge.resultCallback(result);
            return;
        }
    }
    /* {data: {}, success:bool, error:""} */
}

Bridge.Patient = {
    getDetails: function(callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Patient.get"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "patients";
            getFakeUser(function (data) {
                apiUrl = apiUrl + "/" + data.email;
                $.ajax({
                    url: apiUrl + '?token=' + data.token,
                    type: 'GET',
                    crossDomain: true
                }).done(function(result) {
                    if (result.success) {
                        Bridge.resultCallback({success:true, data: result.result, error: undefined});
                    }
                    else {
                        Bridge.resultCallback({success:false, data: undefined, error: "error"});
                    }
                }).fail(function() {
                    Bridge.resultCallback({success:false, data: undefined, error: "error"});
                });
            });
        }
    },
    saveDetails: function(userDetailsModel, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Patient.saveDetails", data: userDetailsModel};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "patient";
            getFakeUser(function (data) {
                apiUrl = apiUrl;
                $.ajax({
                    url: apiUrl + '?token=' + data.token,
                    type: 'POST',
                    crossDomain: true,
                    contentType: "application/json",
                    data: JSON.stringify({ model: userDetailsModel })
                }).done(function(result) {
                    if (result.success) {
                        Bridge.resultCallback({success:true, data: result.result, error: undefined});
                    }
                    else {
                        Bridge.resultCallback({success:false, data: undefined, error: "error"});
                    }
                }).fail(function() {
                    Bridge.resultCallback({success:false, data: undefined, error: "error"});
                });
            });
        }
    }
}

Bridge.CalendarFactory = {
    getCurrentTimeString:function(dateTime) {
        var hours = dateTime.getHours();
        if (hours < 10)hours = '0' + hours;
        var minutes = dateTime.getMinutes();
        if (minutes < 10)minutes = '0' + minutes;
        var seconds = dateTime.getSeconds();
        if (seconds < 10)seconds = '0' + seconds;
        return hours + ':' + minutes + ':' + seconds;
    },
    getEvent:function(slotData, patientData){
        var matchedSlot = _.find(patientData.result,function(slot) {
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
            title: slotData.countOfProviders + " nurses are available.",
            titleText: " nurses are available.",
            slot: slotData,
            start: this.getCurrentTimeString(dateTime),
            icon: 'fa fa-calendar',
            borderColor: '#000000'
        };
        switch(eventType){
            case 'noProvider':
                event.backgroundColor = 'rgb(245,245,245)';
                event.textColor = 'rgb(255,82,82)';
                event.status = "noProvider";
                return event;
                break;
            case 'available':
                event.backgroundColor = 'rgb(245,245,245)';
                event.textColor = 'rgb(100,221,23)';
                event.status = "available";
                return event;
                break;
            case 'appointment':
                event.backgroundColor = 'rgb(245,245,245)';
                event.textColor = 'rgb(0,176,255)';
                event.title = " You have booked the appointment at this time. " + matchedSlot.providerName + " will be with you. Please be online!";
                event.status = "appointment";
                return event;
                break;
        }
    },
    getBookedEvent: function(event, provider) {
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
    },
    getEventById: function(eventId, events) {
        for(var i=0; i<events.length; i++) {
            if (events[i].id === eventId) {
                return events[i];
            }
        }
        return undefined;
    }
}

Bridge.DeviceReceiver = {
    takeMeasure: function(deviceModelType, deviceModel, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"DeviceReceiver.takeMeasure", data: {model: deviceModel, modelType: deviceModelType}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            //fake timeout
            var obj = {
                dateTime: moment(new Date()).utc().valueOf(),
                deviceModelType: deviceModelType
            };

            switch (deviceModelType)
            {
                case "BloodOxygen":
                    obj.spo2 = this.generateRandom(95, 99);
                    obj.pr = this.generateRandom(60, 150);
                    break;
                case "Temperature":
                    obj.temperature = this.generateRandom(36, 42);
                    break;
                case "Weight":
                    obj.value = this.generateRandom(75, 82);
                    break;
                case "BloodPressure":
                    obj.diastolic = this.generateRandom(80, 120);
                    obj.systolic = this.generateRandom(120, 160);
                    break;
            }

            //setTimeout(function(){ Bridge.resultCallback({success:true, data: {status:"measure-taking", value: undefined}, error: undefined}); }, 5000);
            setTimeout(function(){ Bridge.resultCallback({success:true, data: {status:"measure-received", value: obj}, error: undefined}); }, 5000);
            //setTimeout(function(){ Bridge.resultCallback({success:true, data: {status:"measure-timeout", value: undefined}, error: undefined}); }, 5000);
        }
    },
    stopMeasure: function(deviceModelType) {
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"DeviceReceiver.stopMeasure", data: {modelType: deviceModelType}};
            prompt("bridge_key", JSON.stringify(message));
        }
    },
    confirmMeasure: function(value, deviceModelType, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"DeviceReceiver.confirmMeasure", data: {modelType: deviceModelType, value: value}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var obj = {};
            switch (value.deviceModelType)
            {
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
            var apiUrl = Bridge.serverApiUrl + "events";
            getFakeUser(function (data) {
                $.ajax({
                    url: apiUrl + '?token=' + data.token,
                    type: 'POST',
                    crossDomain: true,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: dataToSend
                }).done(function (result) {
                    if (result.success) {
                        Bridge.resultCallback({success:true, data: {status:"measure-confirmed"}, error: undefined});
                    }
                    else {
                        Bridge.resultCallback({success: false, data: undefined, error: result.message});
                    }
                }).fail(function () {
                    Bridge.resultCallback({success: false, data: undefined, error: result.message});
                });
            });
        }
    },
    generateRandom: function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
}

Bridge.DeviceInstaller = {
    showDevicePopup: function(callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"DeviceInstaller.showDevicePopup"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
        }
    },
    closeDevicePopup: function(callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"DeviceInstaller.closeDevicePopup"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
        }
    },
    connectDevice: function(deviceModelType, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"DeviceInstaller.connectDevice", data: {model: deviceModelType}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            //fake timeout
            setTimeout(function(){ Bridge.resultCallback({success:true, data: {status:"connected"}, error: undefined}); }, 5000);
        }
    },
    pairDevice: function(deviceModelType, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"DeviceInstaller.pairDevice", data: {modelType: deviceModelType}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            //fake timeout
            setTimeout(function(){ Bridge.resultCallback({success:true, data: {status:"paired", address: "fake_address"}, error: undefined}); }, 5000);
            //setTimeout(function(){ Bridge.resultCallback({success:false, data: undefined, error: "Device not found!"}); }, 5000);
        }
    },
    addDeviceToLocalStorage: function(device, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"DeviceInstaller.addDeviceToLocalStorage", data:device};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var availableDevices = localStorage.getItem("availableDevices");
            if (availableDevices) {
                var availableDevicesArray = JSON.parse(availableDevices);
                if (availableDevicesArray) {

                    var devices = _.filter(availableDevicesArray,function(d) {
                        return d.model === device.model;
                    });

                    if (!devices || devices.length == 0) {
                        availableDevicesArray.push(device);
                        localStorage.setItem('availableDevices', JSON.stringify(availableDevicesArray));
                    }
                }
            }
            else {
                var availableDevicesNewArray = [];
                if (device)
                {
                    availableDevicesNewArray.push(device);
                    localStorage.setItem('availableDevices', JSON.stringify(availableDevicesNewArray));
                }
            }

            Bridge.resultCallback({success:true, data: {status:"deviceAdded"}, error: undefined});
        }
    },
    getDevicesFromToLocalStorage: function(callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"DeviceInstaller.getDevicesFromToLocalStorage"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var availableDevices = localStorage.getItem("availableDevices");
            if (availableDevices) {
                var availableDevicesArray = JSON.parse(availableDevices);
                if (availableDevicesArray) {
                    Bridge.resultCallback({success:true, data: availableDevicesArray, error: undefined});
                    return;
                }
            }

            Bridge.resultCallback({success:true, data: [], error: undefined});
        }
    }
}

    Bridge.Timeline = {
    getById: function(id, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Timeline.getById", data: id};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "notification";
            getFakeUser(function (data) {
                apiUrl = apiUrl + "?userName=" + data.email + "&dateTime=" +id;

                $.ajax({
                    url: apiUrl + '&token=' + data.token,
                    type: 'GET',
                    crossDomain: true
                }).done(function(result) {
                    if (result.success) {
                        Bridge.resultCallback({success:true, data: result.item, error: undefined});
                    }
                    else {
                        Bridge.resultCallback({success:false, data: undefined, error: "error"});
                    }
                }).fail(function() {
                    Bridge.resultCallback({success:false, data: undefined, error: "error"});
                });
            });
        }
    },
    read: function(id, read, action, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            if (!action || action === "") {
                action = "readMessage";
            }
            var message = { method:"Bridge.Timeline.readNotification", data: {id: id, read: read, action: action} };
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "notificationread";
            getFakeUser(function (data) {
                apiUrl = apiUrl + "?userName=" + data.email + "&dateTime=" + id + "&read=" + !read;
                $.ajax({
                    url: apiUrl + '&token=' + data.token,
                    type: 'POST',
                    crossDomain: true
                }).done(function(result) {
                    if (result.success) {
                        Bridge.resultCallback({success:true, data: undefined, error: undefined});
                    }
                    else {
                        Bridge.resultCallback({success:false, data: undefined, error: "error"});
                    }
                }).fail(function() {
                    debugger;
                    Bridge.resultCallback({success:false, data: undefined, error: "error"});
                });
            });
        }
    },
    getNotifications: function(callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Timeline.getNotifications"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "notifications";
            getFakeUser(function (data) {
                apiUrl = apiUrl + "?userName=" + data.email;
                $.ajax({
                    url: apiUrl + '&token=' + data.token,
                    type: 'GET',
                    crossDomain: true
                }).done(function(result) {
                    if (result.success) {
                        Bridge.resultCallback({success:true, data: result.items, error: undefined});
                    }
                    else {
                        Bridge.resultCallback({success:false, data: undefined, error: "error"});
                    }
                }).fail(function() {
                    Bridge.resultCallback({success:false, data: undefined, error: "error"});
                });
            });
        }
    },
    clearSelectedCards: function(callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Timeline.clearSelectedCards"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            localStorage.setItem("selectedCards", "[]");

            Bridge.resultCallback({success:true, data: [], error: ""});
        }
    },
    getSelectedCards: function(callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Timeline.getSelectedCards"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var selectedCardsJson = localStorage.getItem("selectedCards");

            if (!selectedCardsJson) {
                selectedCardsJson = "[]";
            }

            Bridge.resultCallback({success:true, data: JSON.parse(selectedCardsJson), error: ""});
        }
    },
    changeSelectedCard: function(dateTime, selectionStatus, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Timeline.changeSelectedCard", data: {dateTime: dateTime, selectionStatus: selectionStatus}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var selectedCardsArray = [];
            var selectedCardsJson = localStorage.getItem("selectedCards");
            if (!selectedCardsJson) {
                selectedCardsArray.push({dateTime: dateTime, selectionStatus: selectionStatus});
            }
            else {
                selectedCardsArray = JSON.parse(selectedCardsJson);
                if (selectedCardsArray.length == 0) {
                    if (selectionStatus) {
                        selectedCardsArray.push({dateTime: dateTime, selectionStatus: selectionStatus});
                    }
                } else {
                    var index = _.findIndex(selectedCardsArray, { dateTime: dateTime });

                    if (index >= 0 && !selectionStatus) {
                        selectedCardsArray.splice(index, 1);
                    } else if (index < 0 && selectionStatus) {
                        selectedCardsArray.push({dateTime: dateTime, selectionStatus: selectionStatus});
                    }
                }
            }

            localStorage.setItem("selectedCards", JSON.stringify(selectedCardsArray));
            Bridge.resultCallback({success:true, data: selectedCardsArray, error: ""});
        }
    },
    deleteNotificationCards: function(callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Timeline.deleteNotificationCards"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var selectedCardsJson = localStorage.getItem("selectedCards");
            var selectedCardsArray = JSON.parse(selectedCardsJson);

            if (selectedCardsArray.length > 0) {
                getFakeUser(function (data) {
                    var apiUrl = Bridge.serverApiUrl + "notifications";

                    $.ajax({
                        url: apiUrl + '?token=' + data.token,
                        type: 'DELETE',
                        crossDomain: true,
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(selectedCardsArray)
                    }).done(function(result) {
                        if (result.success) {
                            Bridge.resultCallback({success:true, data: undefined, error: undefined});
                        }
                        else {
                            Bridge.resultCallback({success:false, data: undefined, error: "error"});
                        }
                    }).fail(function() {
                        Bridge.resultCallback({success:false, data: undefined, error: "error"});
                    });
                });
            }
        }
    }
}



