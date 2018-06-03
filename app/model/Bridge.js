/**
 * Created by Victor on 2/22/2016.
 */

var is_keyboard = false;
var is_landscape = false;
var initial_screen_size = window.innerHeight;

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



