import { combineReducers } from 'redux';
import { voiceState } from './voiceState';
import { devices } from './devices';
import { measures } from './measures';
import { dialogState } from './dialogState';
import { ADD_MEASURE_COUNT } from '../actions';
import { SIGN_OUT } from '../actions';
import { SIGN_IN } from '../actions';
import { CURRENT_ACTION } from '../actions';

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

const bloodPressureAssistant = combineReducers({
    voiceState, devices, measures, dialogState, measureCount, userData, currentAction
});

export default bloodPressureAssistant;
