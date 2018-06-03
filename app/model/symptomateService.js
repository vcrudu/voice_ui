import APP_SETTINGS from '../constants/appSettings';
import moment from 'moment';

class SymptomateService {
    constructor() {
        this._app_id = "87976765";
        this._app_key = "3ca4a1561dfebfa01f5616e6dbcc1f6f";
        this._apiUrl = "https://api.infermedica.com/v2/";
        this._commonSymptoms = [
            { "id": "s_21", "name": "Headache" },
            { "id": "s_98", "name": "Fever" },
            { "id": "s_13", "name": "Abdominal pain" },
            { "id": "s_156", "name": "Nausea" },
            { "id": "s_285", "name": "Weight loss" },
            { "id": "s_241", "name": "Worrisome skin lesions" }
        ];
    }

    getEmptyEvidence(dateOfBirth, sex, callBack) {
            var dateOfBirth = new Date(parseFloat(dateOfBirth));
            var ageMS = Date.parse(Date()) - dateOfBirth;
            var age = new Date();
            age.setTime(ageMS);
            var ageYear = age.getFullYear() - 1970;

            callBack(null, { success: true, data: { "sex": sex.toLowerCase(), "age": ageYear.toString(), "evidence": [] }, error: "" });
    }

    getExplainPortObjectEvidence(diagnostic, targetId, sex, dateOfBirth, callBack) {
        var evidenceArray = [];
        _.map(diagnostic.evidence, function (evidence) {
            evidenceArray.push({ id: evidence.id, choice_id: evidence.choice_id });
        });

        var dateOfBirth = new Date(parseFloat(dateOfBirth));

        var ageMS = Date.parse(Date()) - dateOfBirth;
        var age = new Date();
        age.setTime(ageMS);
        var ageYear = age.getFullYear() - 1970;

        callBack(null, { success: true, data: { "sex": sex.toLowerCase(), "age": ageYear.toString(), "evidence": evidenceArray, "target": targetId }, error: "" });
    }

    getSymptoms(callBack) {
        var apiUrl = this._apiUrl + "symptoms";
        $.ajax({
            url: apiUrl,
            type: "GET",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            headers: { "app_id": this._app_id, "app_key": this._app_key, "Accept": "application/json" }
        }).done((response) => {
            let tempArray = [];            
            if (response) {
                    for (var i = 0; i < this._commonSymptoms.length; i++) {
                        for (var j = 0; j < response.length; j++) {
                            if (this._commonSymptoms[i].id === response[j].id) {
                                tempArray.push(response[j]);
                                break;
                            }
                        }
                    }
                callBack(null, tempArray);
            }
            else {
                callBack(null, tempArray);
            }
        }).fail(error => {
            callBack(error, { success: false, data: undefined, error: "error" });
        });
    }

    sendDiagnosis(diagnostic, callBack) {
        let apiUrl = this._apiUrl + "diagnosis";
        let diagnosticString = JSON.stringify(diagnostic);
        $.ajax({
            url: apiUrl,
            type: 'POST',
            crossDomain: true,
            contentType: "application/json",
            headers: { "app_id": this._app_id, "app_key": this._app_key, "Accept": "application/json" },
            data: JSON.stringify(diagnostic)
        }).done((response)=>{
            if (response) {
                callBack(null, { success: true, data: response, error: undefined });
            }
            else {
                callBack(null, { success: false, data: undefined, error: "error" });
            }
        }).fail(error=>{
            callBack(error, { success: false, data: undefined, error: "error" });
        });
    }

    explainDiagnosis(diagnostic, callBack) {
        var apiUrl = this._apiUrl + "explain";
        $.ajax({
            url: apiUrl,
            type: 'POST',
            crossDomain: true,
            contentType: "application/json",
            headers: { "app_id": this._app_id, "app_key": this._app_key, "Accept": "application/json" },
            data: JSON.stringify(diagnostic)
        }).done(function (response) {
            if (response) {
                callBack(null, { success: true, data: response, error: undefined });
            }
            else {
                callBack(null, { success: false, data: undefined, error: "error" });
            }
        }).fail(function (error) {
            callBack(error, { success: false, data: undefined, error: "error" });
        });
    }

    saveResultToStorage(slotId, result, evidence, token, email, callBack) {
        evidence.slotId = slotId;
        evidence.conditions = result;

        for (var i = 0; i < evidence.conditions.length; i++) {
            evidence.conditions[i].probability = evidence.conditions[i].probability.toString();
        }

        evidence.patientId = email;
        var dataToSave = evidence;
        localStorage.setItem("symptomResult", JSON.stringify(dataToSave));

        if (!evidence.slotId) {
            evidence.slotId = moment().valueOf().toString();
            try {
                evidence.symptomDateTime = moment().valueOf().toString();

                var symptomResultToSend = { evidence: evidence };
                var serverUrl = APP_SETTINGS.serverApiUrl;

                $.ajax({
                    url: serverUrl + "symptoms/addPatientSymptoms" + '?token=' + token,
                    type: 'POST',
                    crossDomain: true,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(symptomResultToSend)
                }).done(function (response) {
                    localStorage.setItem("symptomResult", undefined);
                    callBack(null, { success: true, data: undefined, error: undefined });
                }).fail(function () {
                    localStorage.setItem("symptomResult", undefined);
                    callBack(null, { success: true, data: undefined, error: undefined });
                });
            }
            catch (e) {
                callBack(e, { success: true, data: undefined, error: undefined });
            }
        }
        else {
            callBack(null, { success: true, data: dataToSave, error: undefined });
        }
    }

    getEvidenceBySlotId(userId, slotId, token, callBack) {
        var apiUrl = APP_SETTINGS.serverApiUrl + "symptoms/" + userId + "/" + slotId;

        var req = {
            url: apiUrl + '?token=' + token,
            type: 'GET',
            crossDomain: true
        };

        $.ajax(req).done(function (response) {
            if (response.success) {
                callBack(null, response);
            }
            else {
                callBack(response);
            }
        }).fail(function (error) {
            callBack(error);
        });
    }

    getLastEvidence(email, token, callBack) {
            var apiUrl = APP_SETTINGS.serverApiUrl + "symptoms/" + email;

            var req = {
                url: apiUrl + '?token=' + token,
                type: 'GET',
                crossDomain: true
            };

            $.ajax(req).done(function (response) {
                if (response.success) {
                    callBack(response);
                }
                else {
                    callBack(response);
                }
            }).fail(function () {
                callBack(response);
            });
    }
}

const symptomateService = new SymptomateService();

export default symptomateService;