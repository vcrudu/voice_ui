import APP_SETTINGS from '../constants/appSettings';

class ChatApiService{
    getChatMessages(cardDateTime, token, callback) {
        var apiUrl = APP_SETTINGS.serverApiUrl + "chat";
        $.ajax({
            url: apiUrl + '/'+cardDateTime+'?token=' + token,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            "x-access-token": token
        }).done(function (response) {
            callback(null, response);
        }).fail(function (error) {
            callback(error, { success: false, data: undefined, error: "error" });
        });
    }

    getChatsList(token, callback) {
        var apiUrl = APP_SETTINGS.serverApiUrl + "patient_cards";
        $.ajax({
            url: apiUrl + '?token=' + token,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (response) {
            if(callback)
            callback(null, response);
        }).fail(function (error) {
            if(callback)
            callback(error, { success: false, data: undefined, error: "error" });
        });
    }

    getCurrentCard(token, callback) {
        var apiUrl = APP_SETTINGS.serverApiUrl + "patient_cards";
        $.ajax({
            url: apiUrl + '?token=' + token+'&active=true',
            type: "GET",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (response) {
            if(callback)
            callback(null, response);
        }).fail(function (error) {
            if(callback)
            callback(error, { success: false, data: undefined, error: "error" });
        });
    }

    getAllCardds(token, callback) {
        var apiUrl = APP_SETTINGS.serverApiUrl + "patient_cards";
        $.ajax({
            url: apiUrl + '?token=' + token,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        }).done(function (response) {
            if(callback)
            callback(null, response);
        }).fail(function (error) {
            if(callback)
            callback(error, { success: false, data: undefined, error: "error" });
        });
    }

    sendChatMessages(chatMessage, token, callback) {
        var dataToSend = JSON.stringify(chatMessage);
        var apiUrl = APP_SETTINGS.serverApiUrl + "chat";
        $.ajax({
            url: apiUrl + '?token=' + token,
            type: 'POST',
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: dataToSend
        }).done(function (response) {
            if(callback)
            callback(null, response);
        }).fail(function (error) {
            if(callback)
            callback(error, { success: false, data: undefined, error: "error" });
        });
    }

    sendRequest(request, token, callback) {
        var dataToSend = JSON.stringify(request);
        var apiUrl = APP_SETTINGS.serverApiUrl + "chatbot";
        $.ajax({
            url: apiUrl + '?token=' + token,
            type: 'POST',
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: dataToSend
        }).done(function (response) {
            if(callback)
            callback(null, response);
        }).fail(function (error) {
            if(callback)
            callback(error, { success: false, data: undefined, error: "error" });
        });
    }

    pushCard(token, card, callBack) {
        var dataToSend = JSON.stringify(card);
        console.log(APP_SETTINGS.serverUrl);
        $.ajax({
            url: APP_SETTINGS.serverApiUrl + "push_card?token="+token,
            type: 'POST',
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: dataToSend
        }).done(function (response) {
            if (response.success) {
                if(callBack)
                callBack({success:true, data: response.data, error: undefined});
            }else {
                if(callBack)
                callBack({success:false, data: undefined, error: response.error});
            }
        }).fail(function (error) {
            if(callBack)
            callBack({success:false, data: undefined, error: "Signup error ocured! Please contact system administrator."});
        });
    }
}

const chatApiService = new ChatApiService();

export default chatApiService;