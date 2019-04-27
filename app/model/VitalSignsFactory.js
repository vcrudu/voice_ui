import moment from 'moment';
var VitalSignsFactory = {};
import _ from 'underscore';

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

function aggregateWeigh (objectToReturn){
    let groups = _.groupBy(objectToReturn.weightDef.values, (item)=>{
        return moment(item.time).startOf('day')
    });

    let avv = 
    _.map(groups,(group, key)=>{
         let avv = group.reduce((acc,item)=>
         {
            return acc+item.value;
        },
        0)/group.length;

         return {
             value:Math.floor(avv),
             time:moment(key).valueOf()}
    });

    objectToReturn.weightDef.details = objectToReturn.weightDef.values;
    objectToReturn.weightDef.avv = avv;
    objectToReturn.weightDef.values = avv;
}

function aggregateBp(objectToReturn){
    let groups = _.groupBy(objectToReturn.bloodPressureDef.values, (item)=>{
        return moment(item.time).startOf('day')
    });
    let avv = 
    _.map(groups,(group, key)=>{
         let diastolicAvv = group.reduce((acc,item)=>
         {
            return acc+item.value.diastolic;
        },
        0)/group.length;
        let systolicAvv = group.reduce((acc,item)=>
         {
            return acc+item.value.systolic;
        },
        0)/group.length;
         return {
             value:{diastolic:Math.floor(diastolicAvv), systolic:Math.floor(systolicAvv)},
             time:moment(key).valueOf()}
    });

    objectToReturn.bloodPressureDef.details = objectToReturn.bloodPressureDef.values;
    objectToReturn.bloodPressureDef.avv = avv;
    objectToReturn.bloodPressureDef.values = avv;

    if (avv.length > 0) {
        let firstDay = moment(avv[0].time);
        avv.forEach((item) => item.days = moment.duration(moment(item.time).diff(firstDay)).asDays());
        objectToReturn.bloodPressureDef.systolicMeanY = avv.reduce((acc, item) => acc + item.value.systolic, 0) / avv.length;
        objectToReturn.bloodPressureDef.systolicMeanX = avv.reduce((acc, item) => acc + item.days, 0) / avv.length;
        objectToReturn.bloodPressureDef.systolicDeviationY =
            Math.sqrt(avv.reduce((acc, item) => {
                return acc + Math.pow(item.value.systolic - objectToReturn.bloodPressureDef.systolicMeanY, 2);
            }, 0) / avv.length);
        objectToReturn.bloodPressureDef.systolicDeviationX =
            Math.sqrt(avv.reduce((acc, item) => {
                return acc + Math.pow(item.days - objectToReturn.bloodPressureDef.systolicMeanX, 2);
            }, 0) / avv.length);
            
        let sumXY = avv.reduce((acc, item) => acc + item.value.systolic * item.days, 0);
        let sumX2 = avv.reduce((acc, item) => acc + Math.pow(item.days, 2), 0);
        let sumY2 = avv.reduce((acc, item) => acc + Math.pow(item.value.systolic, 2), 0);
        let sqrtX2Y2 = Math.sqrt(sumX2 * sumY2);
        objectToReturn.bloodPressureDef.systolicCorrelation = sumXY / sqrtX2Y2;

        objectToReturn.bloodPressureDef.b = 
        objectToReturn.bloodPressureDef.systolicCorrelation * 
        objectToReturn.bloodPressureDef.systolicDeviationY /
        objectToReturn.bloodPressureDef.systolicDeviationX;

        objectToReturn.bloodPressureDef.A = 
        objectToReturn.bloodPressureDef.systolicMeanY - 
        objectToReturn.bloodPressureDef.b * objectToReturn.bloodPressureDef.systolicMeanX;
        //Y = bX + A
    }

}

VitalSignsFactory.createVitalSings = function(data) {

    if (!data || data.length==0 ||
        !_.find(data,(item)=>item.measurementType==='bloodPressure')) {
        data.push(
            {
                measurementType: "bloodPressure",
                value: { systolic: 145, diastolic: 105 },
                utcDateTime: moment().valueOf()
            });
        data.push({
                measurementType: "bloodPressure",
                value: { systolic: 135, diastolic: 103 },
                utcDateTime: moment().add(-1,'d').valueOf()
            });
        data.push({
                measurementType: "bloodPressure",
                value: { systolic: 146, diastolic: 106 },
                utcDateTime: moment().add(-2,'d').valueOf()
            });
    }

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

    aggregateBp(objectToReturn);
    aggregateWeigh(objectToReturn);
    
    return objectToReturn;
}

VitalSignsFactory.createExerciseData = function(data) {

    if (!data || data.length==0) {
        let data = [
                {
                    time: today.add(-8, 'd').valueOf(),
                    value: 28,
                    unit: 'min'
                },
                {
                    time: today.add(-7, 'd').valueOf(),
                    value: 25,
                    unit: 'min'
                },
                {
                    time: today.add(-6, 'd').valueOf(),
                    value: 20,
                    unit: 'min'
                },
                {
                    time: today.add(-5, 'd').valueOf(),
                    value: 20,
                    unit: 'min'
                },
                {
                    time: today.add(-4, 'd').valueOf(),
                    value: 35,
                    unit: 'min'
                },
                {
                    time: today.add(-3, 'd').valueOf(),
                    value: 25,
                    unit: 'min'
                },
                {
                    time: today.add(-2, 'd').valueOf(),
                    value: 33,
                    unit: 'min'
                },
                {
                    time: today.add(-1, 'd').valueOf(),
                    value: 29,
                    unit: 'min'
                },
                {
                    time: today.valueOf(),
                    value: 31,
                    unit: 'min'
                }];
    }

    var objectToReturn = {
        exerciseDef: {
            label: "Exercise",
            measurementType: "activity",
            unit: "min",
            minValue: 0,
            maxValue: 300,
            values: []
        }
    };

    if (data) {
        var sortedResult = _.sortBy(data, function(item) {
            return item.utcDateTime;
        });

        _.each(sortedResult, function(item) {
                    objectToReturn.exerciseDef.values.push({
                        value: item.value,
                        time: item.utcDateTime
                    });
        })
    }
    
    return objectToReturn;
}

module.exports = VitalSignsFactory;