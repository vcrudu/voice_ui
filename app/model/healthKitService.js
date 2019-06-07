import moment from 'moment';
import _ from 'underscore';

const measureTypesTrihcrome = ["heartRate","bloodPressure","bloodGlucose",
        "bloodOxygen","respiratoryRate","temperature",
        "weight", "fallDetection","bloodInr","ecg","questionAnswer",
        "steps","distance",
        "appleExerciseTime",
        "calories",
        "caloriesActive",
        "caloriesBasal",
        "activity",
        "fatPercentage",
        "insulin",
        "nutrition",
        "nutritionCalories",
        "nutritionFatTotal",
        "nutritionFatSaturated",
        "nutritionFatUnsaturated",
        "nutritionFatPolyunsaturated",
        "nutritionFatMonounsaturated",
        "nutritionFatTrans",
        "nutritionCholesterol",
        "nutritionSodium",
        "nutritionPotassium",
        "nutritionCarbsTotal",
        "nutritionDietaryFiber",
        "nutritionSugar",
        "nutritionProtein",
        "nutritionVitaminA",
        "nutritionVitaminC",
        "nutritionCalcium",
        "nutritionIron",
        "nutritionWater",
        "nutritionCaffeine"
    ];

const measureTypesHealthKit = {
    steps: "steps",
    distance: "distance",
    appleExerciseTime: "exercise",
    calories: "calories",
    "calories.active": "caloriesActive",
    "calories.basal": "caloriesBasal",
    "activity": "activity",
    "height": "height",
    "weight": "weight",
    "heart_rate": "heartRate",
    "fat_percentage": "fatPercentage",
    "blood_pressure": "bloodPressure",
    "blood_glucose": "bloodGlucose",
    "insulin": "insulin",
    "nutrition": "nutrition",
    "nutrition.calories": "nutritionCalories",
    "nutrition.fat.total": "nutritionFatTotal",
    "nutrition.fat.saturated": "nutritionFatSaturated",
    "nutrition.fat.polyunsaturated": "nutritionFatPolyunsaturated",
    "nutrition.fat.monounsaturated": "nutritionFatMonounsaturated",
    "nutrition.cholesterol": "nutrition.cholesterol",
    "nutrition.sodium": "nutritionSodium",
    "nutrition.potassium": "nutritionPotassium",
    "nutrition.carbs.total": "nutritionCarbsTotal",
    "nutrition.dietary_fiber": "nutritionDietaryFiber",
    "nutrition.sugar": "nutritionSugar",
    "nutrition.protein": "nutritionProtein",
    "nutrition.vitamin_a": "nutritionVitaminA",
    "nutrition.vitamin_c": "nutritionVitaminC",
    "nutrition.calcium": "nutrition.calcium",
    "nutrition.iron": "nutrition.iron",
    "nutrition.water": "nutrition.water",
    "nutrition.caffeine": "nutrition.caffeine"
}

const measureTypesHealthKitFields = [
    "steps",
    "distance",
    "appleExerciseTime",
    "calories",
    "calories.active",
    "calories.basal",
    "activity",
    "height",
    "weight",
    "heart_rate",
    "fat_percentage",
    "blood_glucose",
    "insulin",
    "blood_pressure",
    "nutrition",
    "nutrition.calories",
    "nutrition.fat.total",
    "nutrition.fat.saturated",
    "nutrition.fat.polyunsaturated",
    "nutrition.fat.monounsaturated",
    "nutrition.cholesterol",
    "nutrition.sodium",
    "nutrition.potassium",
    "nutrition.carbs.total",
    "nutrition.dietary_fiber",
    "nutrition.sugar",
    "nutrition.protein",
    "nutrition.vitamin_a",
    "nutrition.vitamin_c",
    "nutrition.calcium",
    "nutrition.iron",
    "nutrition.water",
    "nutrition.caffeine"
];

class HealthKitService{
    constructor(){
        this._initialized = false;     
        this.successHealthRepositoryAuthorizationCallback = 
         this.successHealthRepositoryAuthorizationCallback.bind(this);
        this.successHealthRepositoryInitCallback = 
         this.successHealthRepositoryInitCallback.bind(this);
         this.errorHealthRepositoryCallback = 
         this.errorHealthRepositoryCallback.bind(this);
    }

    successHealthRepositoryAuthorizationCallback(){
        console.log('Health repository authorized');
        this._initialized = true;
        if(this._success) this._success();
    }

    isAvailable(){
        return !!this._initialized;
    }

    successHealthRepositoryInitCallback() {
        console.log('Health repository exists');
        const datatypes = [
            {
                read: measureTypesHealthKitFields
            }
        ];

        navigator.health.requestAuthorization(datatypes,
            this.successHealthRepositoryAuthorizationCallback,
            this.errorHealthRepositoryCallback)
    }
    
    errorHealthRepositoryCallback(err){
        console.log('Health repository error: '+JSON.stringify(err));
        if(this._error) this._error(err);
    }
    
    initHealthRepository(success, error){
        this._success = success;
        this._error = error;
        if(navigator.health){
            navigator.health.isAvailable(
                this.successHealthRepositoryInitCallback, 
                this.errorHealthRepositoryCallback);
        }
    }

    queryDataMultiple(startDate, dataTypes, successDataCallback, errorDataCallback) {
        var callsCount = 0;
        var results = [];
        var errorsResult = [];
        _.forEach(dataTypes, (dataType) => {
            var data_type = dataType;
            this.queryData(startDate, dataType,
                (data) => {
                    callsCount++;
                    _.forEach(data,(item)=>{
                        if(data_type==="blood_pressure" &&
                           (!item.value.systolic || !item.value.diastolic)){
                            return;
                        }
                        item.dataType = measureTypesHealthKit[data_type];
                        results.push(item);
                    });

                    if(callsCount===dataTypes.length){
                        successDataCallback(_.sortBy(results,(item)=>{
                            return moment(item.endDate).valueOf()
                        }));
                    }
                },
                (err) => {
                    errorsResult = errorsResult.concat(err);
                    callsCount++;
                    if(callsCount===dataTypes.length){
                        errorDataCallback(errorsResult);
                    }
                }
            );
        });
    }

    queryData(startDate, dataType, successDataCallback, errorDataCallback){
        navigator.health.query({
            startDate: moment(startDate).toDate(), 
            endDate: moment().toDate(), // now
            dataType: dataType,
            limit: 1000
          }, successDataCallback, errorDataCallback)
    }

    queryToday(dataType, successDataCallback, errorDataCallback) {
        if (navigator.health) {
            navigator.health.queryAggregated({
                startDate: new Date(moment().startOf('day').valueOf()), // three days ago
                endDate: new Date(moment().valueOf()), // now
                dataType: dataType,
                bucket: 'day'
              }, (data)=>{ 
                  data.color = this.getColor(data, dataType);
                  successDataCallback(data)});
        } else{
            successDataCallback({ color: 'green', startDate: moment().startOf('day'), endDate: moment(), value: 3500.0, unit: 'm' })
        }
    }

    getColor(data, dataType) {
        if (!data) return '#ffa000';
        switch (dataType) {
            case 'distance':
                if (data.value < 500) {
                    return 'red';
                } else if (data.value < 2000) {
                    return '#ffa000';
                } else {
                    return 'green';
                }
                break;
            default:
                return 'red';
        }
    }
}

const healthKitService = new HealthKitService();

export default healthKitService;