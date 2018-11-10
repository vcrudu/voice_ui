import APP_SETTINGS from '../constants/appSettings';

class ChatApiService{
    getChatMessages(email, callBack) {
        var apiUrl = APP_SETTINGS.enrolServerUrl + "chat";
        $.ajax({
            url: apiUrl + '/' + email,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
        }).done(function (response) {
            callBack(null, response);
        }).fail(function (error) {
            callBack(error, { success: false, data: undefined, error: "error" });
        });
    }

    sendChatMessages(email, message, callback) {
        message.email = email;
        var dataToSend = JSON.stringify(message);
        var apiUrl = APP_SETTINGS.enrolServerUrl + "chat";
        $.ajax({
            url: apiUrl + '/' + email,
            type: 'POST',
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: dataToSend
        }).done(function (response) {
            if(callback)
            callBack(null, response);
        }).fail(function (error) {
            callBack(error, { success: false, data: undefined, error: "error" });
        });
    }
}

const chatApiService = new ChatApiService();

export default chatApiService;