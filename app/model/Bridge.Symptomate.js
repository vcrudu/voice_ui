/**
 * Created by Victor on 6/22/2016.
 */

Bridge.Symptomate = {
    app_id: "87976765",
    app_key: "3ca4a1561dfebfa01f5616e6dbcc1f6f",
    apiUrl: "https://api.infermedica.com/v2/",
    commonSymptoms: [
        {"id": "s_21", "name": "Headache"},
        {"id": "s_98", "name": "Fever"},
        {"id": "s_13", "name": "Abdominal pain"},
        {"id": "s_156", "name": "Nausea"},
        {"id": "s_285", "name": "Weight loss"},
        {"id": "s_241", "name": "Worrisome skin lesions",}
    ],
    getEmptyEvidence: function(callBack) {
        Bridge.resultCallback = callBack;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Symptomate.getEmptyEvidence"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            getFakeUser(function (data) {
                var dateOfBirth = new Date(parseFloat(data.dateOfBirth));
                var sex = data.sex;

                var ageMS = Date.parse(Date()) - dateOfBirth;
                var age = new Date();
                age.setTime(ageMS);
                var ageYear = age.getFullYear() - 1970;

                Bridge.resultCallback({success: true, data: {"sex": sex.toLowerCase(), "age": ageYear.toString(), "evidence": []}, error: ""});
            });
        }
    },
    getExplainPortObjectEvidence: function(diagnostic, targetId, callBack) {
        Bridge.resultCallback = callBack;

        var evidenceArray = [];
        _.map(diagnostic.evidence, function (evidence) {
            evidenceArray.push({id: evidence.id, choice_id: evidence.choice_id});
        });

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Symptomate.getExplainObjectToPost", data: {evidence: evidenceArray, target: targetId}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            getFakeUser(function (data) {
                var dateOfBirth = new Date(parseFloat(data.dateOfBirth));
                var sex = data.sex;

                var ageMS = Date.parse(Date()) - dateOfBirth;
                var age = new Date();
                age.setTime(ageMS);
                var ageYear = age.getFullYear() - 1970;

                Bridge.resultCallback({success: true, data: {"sex": sex.toLowerCase(), "age": ageYear.toString(), "evidence": evidenceArray, "target": targetId}, error: ""});
            });
        }
    },
    getSymptoms: function(callBack) {
        Bridge.resultCallback = callBack;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Symptomate.getSymptoms"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = this.apiUrl + "symptoms";
            /*getFakeUser(function (data) {*/
            $.ajax({
                url: apiUrl,
                type: "GET",
                crossDomain: true,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                headers: {"app_id": Bridge.Symptomate.app_id, "app_key": Bridge.Symptomate.app_key, "Accept": "application/json"}
            }).done(function (result) {
                if (result) {
                    Bridge.resultCallback({success: true, data: result, error: undefined});
                }
                else {
                    Bridge.resultCallback({success: false, data: undefined, error: "error"});
                }
            }).fail(function () {
                Bridge.resultCallback({success: false, data: undefined, error: "error"});
            });
            /*});*/
        }
    },
    sendDiagnosis: function(diagnostic, callBack) {
        Bridge.resultCallback = callBack;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Symptomate.sendDiagnosis", data: diagnostic};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = this.apiUrl + "diagnosis";
            getFakeUser(function (data) {
                $.ajax({
                    url: apiUrl,
                    type: 'POST',
                    crossDomain: true,
                    contentType: "application/json",
                    headers: {"app_id": Bridge.Symptomate.app_id, "app_key": Bridge.Symptomate.app_key, "Accept": "application/json"},
                    data: JSON.stringify(diagnostic)
                }).done(function (result) {
                    if (result) {
                        Bridge.resultCallback({success: true, data: result, error: undefined});
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
    explainDiagnosis: function(diagnostic, callBack) {
        Bridge.resultCallback = callBack;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Symptomate.explainDiagnosis", data: diagnostic};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = this.apiUrl + "explain";
            $.ajax({
                url: apiUrl,
                type: 'POST',
                crossDomain: true,
                contentType: "application/json",
                headers: {"app_id": Bridge.Symptomate.app_id, "app_key": Bridge.Symptomate.app_key, "Accept": "application/json"},
                data: JSON.stringify(diagnostic)
            }).done(function (result) {
                if (result) {
                    Bridge.resultCallback({success: true, data: result, error: undefined});
                }
                else {
                    Bridge.resultCallback({success: false, data: undefined, error: "error"});
                }
            }).fail(function () {
                Bridge.resultCallback({success: false, data: undefined, error: "error"});
            });
        }
    },
    saveResultToStorage: function(slotId, result, evidence, callBack) {
        evidence.slotId = slotId;
        evidence.conditions = result;

        for(var i = 0; i < evidence.conditions.length; i++){
            evidence.conditions[i].probability = evidence.conditions[i].probability.toString();
        }

        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Symptomate.saveResultToStorage", data: evidence};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            getFakeUser(function (data) {
                evidence.patientId = data.email;
                var dataToSave = evidence;
                localStorage.setItem( "symptomResult", JSON.stringify(dataToSave));

                if (!evidence.slotId) {
                    evidence.slotId = moment().valueOf().toString();
                    try{
                        evidence.symptomDateTime = moment().valueOf().toString();

                        var symptomResultToSend = {evidence: evidence};
                        var serverUrl = Bridge.serverApiUrl;

                        $.ajax({
                            url: serverUrl + "symptoms/addPatientSymptoms" + '?token=' + data.token,
                            type: 'POST',
                            crossDomain: true,
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify(symptomResultToSend)
                        }).done(function(result) {
                            localStorage.setItem("symptomResult", undefined);
                            Bridge.resultCallback({success: true, data: undefined, error: undefined});
                        }).fail(function() {
                            localStorage.setItem("symptomResult", undefined);
                            Bridge.resultCallback({success: true, data: undefined, error: undefined});
                        });
                    }
                    catch(e) {
                        Bridge.resultCallback({success: true, data: undefined, error: undefined});
                    }
                }
                else {
                    Bridge.resultCallback({success: true, data: dataToSave, error: undefined});
                }
            });
        }
    },
    getEvidenceBySlotId: function(userId, slotId, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Symptomate.getEvidenceBySlotId", data: {userId: userId, slotId: slotId}};
            prompt("bridge_key", JSON.stringify(message));
        } else {

            getFakeWhoProvider(function (data) {
                var apiUrl = Bridge.serverApiUrl + "symptoms/" + userId + "/" + slotId;

                var req = {
                    url: apiUrl + '?token=' + data.token,
                    type: 'GET',
                    crossDomain: true
                };

                $.ajax(req).done(function (response) {
                    if (response.success) {
                        Bridge.resultCallback(response);
                    }
                    else {
                        Bridge.resultCallback(response);
                    }
                }).fail(function () {
                    Bridge.resultCallback(response);
                });
            });
        }
    },
    getLastEvidence: function(callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Symptomate.getLastEvidence"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            getFakeUser(function (data) {
                var apiUrl = Bridge.serverApiUrl + "symptoms/" + data.email;

                var req = {
                    url: apiUrl + '?token=' + data.token,
                    type: 'GET',
                    crossDomain: true
                };

                $.ajax(req).done(function (response) {
                    if (response.success) {
                        Bridge.resultCallback(response);
                    }
                    else {
                        Bridge.resultCallback(response);
                    }
                }).fail(function () {
                    Bridge.resultCallback(response);
                });
            });
        }
    }
}