import { combineReducers } from 'redux';
import { voiceState } from './voiceState';
import { devices } from './devices';
import { measures } from './measures';
import { dialogState } from './dialogState';
import { chatState } from './chatState';
import { ADD_MEASURE_COUNT } from '../actions';
import { SIGN_OUT } from '../actions';
import { SIGN_IN } from '../actions';
import { CURRENT_ACTION } from '../actions';
import { PAIR_ACTION } from '../actions';
import { CHANGE_SCREEN_TITLE } from '../actions';
import { UPDATE_SETTINGS_DATA } from '../actions';


export const measureCount = (state = { count: 0 }, action) => {
    switch (action.type) {
        case ADD_MEASURE_COUNT:
            return { measureCount: state.count < 2 ? state.count++ : 0 }
        default:
            return state;
    }
}

export const userData = (state={}, action) => {
    switch (action.type) {
        case SIGN_IN:
        case SIGN_OUT:
            return action.userData;
        default:
            return state;
    }
}

export const currentAction = (state={}, action) => {
    switch (action.type) {
        case CURRENT_ACTION:
            return action.currentAction;
        default:
            return state;
    }
}

export const pairDeviceAction = (state={}, action) => {
    switch (action.type) {
        case PAIR_ACTION:
            if (window.bluetoothSerial) {
                bluetoothSerial.list((ar1, ar2)=>{
                    console.log(ar1);
                }, (ar1, ar2)=>{
                    console.log(ar1);
                });
            }
            return state;
        default:
            return state;
    }
}

export const navigationState = (state = {}, action) => {
    switch (action.type) {
        case CHANGE_SCREEN_TITLE:
            return { title: action.title }
        default:
            return state;
    }
}

export const settingsData = (state={}, action) => {
    switch (action.type) {
        case UPDATE_SETTINGS_DATA:
            let newState = {...state};
            newState[action.settingName] = action.value;
            return newState;
        default:
            return state;
    }
}

const bloodPressureAssistant = combineReducers({
    voiceState, 
    devices, measures, 
    dialogState, measureCount, 
    userData, currentAction, 
    pairDeviceAction,
    navigationState,
    chatState,
    settingsData
});

export default bloodPressureAssistant;
