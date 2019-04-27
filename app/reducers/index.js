import { combineReducers } from 'redux';
import { voiceState } from './voiceState';
import { devices } from './devices';
import { measures } from './measures';
import { chatState } from './chatState';
import moment from 'moment';
import { ADD_MEASURE_COUNT } from '../actions';
import { SIGN_OUT } from '../actions';
import { SIGN_IN } from '../actions';
import { CURRENT_ACTION } from '../actions';
import { PAIR_ACTION } from '../actions';
import { CHANGE_SCREEN_TITLE } from '../actions';
import { UPDATE_SETTINGS_DATA } from '../actions';
import { UPDATE_USER_DATA } from '../actions';
import { REMOVE_CURRENT_ACTION } from '../actions';
import { CURRENT_CHAT_COMMAND } from '../actions';
import { REGISTER_NOTIFICATION } from '../actions';
import { UPDATE_DIALOG_STATE } from '../actions';
import { REFRESH_CARDS } from '../actions';
import { UPDATE_HEALTHKIT_SYNC_DATE } from '../actions';
import { UPDATE_MENU_HEIGHT } from '../actions';
import { UPDATE_TOOLBAR_HEIGHT } from '../actions';
import { UPDATE_VIEW_HEIGHT } from '../actions';


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
        case UPDATE_USER_DATA:
            let newState = {...state};
            newState[action.settingName] = action.value;
            return newState;
        default:
            return state;
    }
}

export const currentAction = (state={}, action) => {
    switch (action.type) {
        case CURRENT_ACTION:
            return action.currentAction;
        case REMOVE_CURRENT_ACTION:
            return {};
        default:
            return state;
    }
}

export const currentChatCommand = (state={}, action) => {
    switch (action.type) {
        case CURRENT_CHAT_COMMAND:
            return action.currentChatCommand;
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

export const notificationData = (state = null, action) => {
    switch (action.type) {
        case REGISTER_NOTIFICATION:
            return { registrationId: action.registrationId }
        default:
            return state;
    }
}

export const dialogState = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_DIALOG_STATE:
            let newState = {...action.dialogState};
            newState.state = {...action.dialogState.state};
            newState.state.transitions = {...action.dialogState.state.transitions}
            return newState;
        default:
            return state;
    }
}

export const patientCards = (state = null, action) => {
    switch (action.type) {
        case REFRESH_CARDS:
            return action.cards
        default:
            return state;
    }
}

export const healthKitSyncDate = (state = moment().year(1976).valueOf(), action) => {
    switch (action.type) {
        case UPDATE_HEALTHKIT_SYNC_DATE:
            return action.date
        default:
            return state;
    }
}

export const layoutHeight = (state = {}, action) => {
    let newState = {...state};
    switch (action.type) {
        case UPDATE_MENU_HEIGHT:
            newState.menuHeight = action.data.menuHeight;
            return newState;
        case UPDATE_TOOLBAR_HEIGHT:
            newState.toolbarHeight = action.data.toolbarHeight;
            return newState;
        case UPDATE_VIEW_HEIGHT:
            newState.viewHeight = action.data.viewHeight
            return newState;
        default:
            return state;
    }
}

const bloodPressureAssistant = combineReducers({
    voiceState, 
    devices, measures, 
    dialogState, measureCount, 
    userData, userData, 
    currentAction: currentAction,
    pairDeviceAction,
    navigationState,
    chatState,
    settingsData,
    currentChatCommand,
    notificationData,
    dialogState,
    patientCards,
    healthKitSyncDate,
    layoutHeight
});

export default bloodPressureAssistant;
