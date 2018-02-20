import APP_SETTINGS from '../constants/appSettings';

class ApiService{
    signUp(signUpData, callBack) {
        var dataToSend = JSON.stringify(signUpData);
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

    signIn(signInData, callBack) {
        var dataToSend = JSON.stringify(signInData);
        $.ajax({
            url: APP_SETTINGS.serverUrl + "signin",
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

    error(errorData) {
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