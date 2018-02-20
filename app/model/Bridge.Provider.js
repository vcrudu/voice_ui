/**
 * Created by Victor on 3/17/2016.
 */

Bridge.Provider = {
    getAppointments: function(callBack) {
        Bridge.resultCallback = callBack;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Provider.getAppointments"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "appointments";
            getFakeWhoProvider(function (data) {
                var req = {
                    url: apiUrl + '?token=' + data.token,
                    type: 'GET',
                    crossDomain: true
                };

                $.ajax(req).done(function(response) {
                    if (response.success) {
                        Bridge.resultCallback({success:true, data: response.result, error: undefined});
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
    getPatientVitalSigns: function(userId, callBack) {
        Bridge.resultCallback = callBack;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Provider.getPatientVitalSigns", data: {userId: userId}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "events";
            getFakeWhoProvider(function (data) {
                $.ajax({
                    url: apiUrl + '?token=' + data.token + '&userName=' + userId,
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
    },
    getPatientDetails: function(userId, callBack) {
        Bridge.resultCallback = callBack;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Provider.getPatientDetails", data: {userId: userId}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "patients/" + userId;
            getFakeWhoProvider(function (data) {
                $.ajax({
                    url: apiUrl + '?token=' + data.token,
                    type: "GET",
                    crossDomain: true,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                }).done(function (data) {
                    if (data.success) {
                        Bridge.resultCallback({success: true, data: data.result, error: undefined});
                    }
                    else {
                        Bridge.resultCallback({success: false, data: undefined, error: "error"});
                    }
                }).fail(function () {
                    Bridge.resultCallback({success: false, data: undefined, error: "error"});
                });
            });
        }
    },
    getProviderDetails: function(userId, callBack) {
        Bridge.resultCallback = callBack;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Provider.getProviderDetails", data: {userId: userId}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "provider/?providerId=" + userId;
            getFakeWhoProvider(function (data) {
                $.ajax({
                    url: apiUrl + '&token=' + data.token,
                    type: "GET",
                    crossDomain: true,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                }).done(function (data) {
                    if (data.success) {
                        Bridge.resultCallback({success: true, data: data.result, error: undefined});
                    }
                    else {
                        Bridge.resultCallback({success: false, data: undefined, error: "error"});
                    }
                }).fail(function () {
                    Bridge.resultCallback({success: false, data: undefined, error: "error"});
                });
            });
        }
    },
    callPatient: function(patientId, patientName, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Provider.callPatient", data: {userId: patientId, name: patientName}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
        }
    },
    socketCallBack: function(socketMessage){
        if(Bridge.Provider.socketCallback){
            if(socketMessage){
                Bridge.Provider.socketCallback(socketMessage);
                return;
            }
        }
    },
    getProviderSlots: function(start,end,callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            function getCurrentTimeString(dateTime) {
                var momentInstance = moment(dateTime);
                return momentInstance.format("YYYY-MM-DD HH:mm:ss");
            }

            var startDate=getCurrentTimeString(start._d);
            var endDate=getCurrentTimeString(end._d);

            var message = {method:"Bridge.Provider.getProviderSlots", data: {start:startDate, end: endDate}};
            prompt("bridge_key", JSON.stringify(message));

        } else {
            var apiUrl = Bridge.serverApiUrl + "provider_availability_period";

            function getCurrentTimeString(dateTime) {
                var momentInstance = moment(dateTime);
                return momentInstance.format("YYYY-MM-DD HH:mm:ss");
            }

            var startDate=getCurrentTimeString(start._d);
            var endDate=getCurrentTimeString(end._d);
            getFakeWhoProvider(function (data) {
                $.ajax({
                    url: apiUrl + '?token=' + data.token+'&startDate=' + startDate + '&endDate=' + endDate,
                    type: 'GET',
                    crossDomain: true
                }).done(function(result) {
                    Bridge.resultCallback({success:true, data: result.result, error: undefined});
                }).fail(function() {
                    Bridge.resultCallback({success:false, data: undefined, error: "error"});
                });
            });
        }
    },
    getProviderSlotById: function(slotId, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Provider.getProviderSlotById", data: {slotId: slotId}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "slots/" + slotId;
            getFakeWhoProvider(function (data) {
                $.ajax({
                    url: apiUrl + '?token=' + data.token,
                    type: 'GET',
                    crossDomain: true,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                }).done(function (result) {
                    Bridge.resultCallback({success: true, data: result.result, error: undefined});
                }).fail(function () {
                    Bridge.resultCallback({success: false, data: undefined, error: "error"});
                });
            });
        }
    },
    providerSetAvailability: function(slot, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Provider.setAvailability", data: slot};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "availability";
            getFakeWhoProvider(function (data) {
                var dataToSend = JSON.stringify(slot);
                $.ajax({
                    url: apiUrl + '?token=' + data.token,
                    type: 'POST',
                    crossDomain: true,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: dataToSend
                }).done(function (result) {
                    Bridge.resultCallback({success: true, data: result, error: undefined});
                }).fail(function () {
                    Bridge.resultCallback({success: false, data: undefined, error: "error"});
                });
            });
        }
    },
    providerUpdateAvailability: function(slot, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Provider.updateAvailability", data: slot};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "availability";
            getFakeWhoProvider(function (data) {
                var dataToSend = JSON.stringify(slot);
                $.ajax({
                    url: apiUrl + '?token=' + data.token,
                    type: 'PUT',
                    crossDomain: true,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: dataToSend
                }).done(function (result) {
                    Bridge.resultCallback({success: true, data: result, error: undefined});
                }).fail(function () {
                    Bridge.resultCallback({success: false, data: undefined, error: "error"});
                });
            });
        }
    }
}