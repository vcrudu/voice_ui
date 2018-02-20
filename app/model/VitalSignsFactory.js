/**
 * Created by Victor on 2/26/2016.
 */

var VitalSignsFactory = {};

VitalSignsFactory.createEmptyVitalSings = function() {
    var objectToReturn = {
        temperatureVitalSignsDef: {
            label: "Temperature",
            measurementType: "temperature",
            unit: "&#176;C",
            minValue: 30,
            maxValue: 43,
            values: []
        },
        bloodPressureDef: {
            label: "Blood Pressure",
            measurementType: "bloodPressure",
            unit: "mmHg",
            minValue: 50,
            maxValue: 150,
            values: []
        },
        bloodOxygenDef: {
            label: "Blood Oxygen",
            measurementType: "bloodOxygen",
            unit: "SO<sub>2</sub>",
            minValue: 90,
            maxValue: 100,
            values: []
        },
        heartRateDef: {
            label: "Heart Rate",
            measurementType: "heartRate",
            unit: "Bpm",
            minValue: 30,
            maxValue: 200,
            values: []
        },
        weightDef: {
            label: "Weight",
            measurementType: "weight",
            unit: "kg",
            minValue: 0,
            maxValue: 150,
            values: []
        },
    };

    return objectToReturn;
}

VitalSignsFactory.createVitalSings = function(data) {

    var objectToReturn = this.createEmptyVitalSings();

    if (data) {
        var sortedResult = _.sortBy(data, function(item) {
            return item.utcDateTime;
        });

        _.each(sortedResult, function(item) {
            switch (item.measurementType)
            {
                case "temperature":
                    objectToReturn.temperatureVitalSignsDef.values.push({
                        value: item.value,
                        time: item.utcDateTime
                    });
                    break;
                case "bloodOxygen":
                    objectToReturn.bloodOxygenDef.values.push({
                        value: item.value,
                        time: item.utcDateTime
                    });
                    break;
                case "heartRate":
                    objectToReturn.heartRateDef.values.push({
                        value: item.value,
                        time: item.utcDateTime
                    });
                    break;
                case "weight":
                    objectToReturn.weightDef.values.push({
                        value: item.value,
                        time: item.utcDateTime
                    });
                    break;
                case "bloodPressure":
                    objectToReturn.bloodPressureDef.values.push({
                        value: {
                            systolic: item.value.systolic,
                            diastolic: item.value.diastolic
                        },
                        time: item.utcDateTime
                    });
                    break;
            }
        })
    }

    return objectToReturn;
}