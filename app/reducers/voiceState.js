import { TOGGLE_SOUND } from '../actions';
import { SWITCH_MICROPHONE } from '../actions';

const initialState = {
    voiceState: 'on',
    microphoneState: 'off'
}

export const voiceState = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_SOUND:
            return { microphoneState: state.microphoneState, voiceState: action.onOff };
        case SWITCH_MICROPHONE:
            return { voiceState: state.voiceState, microphoneState: action.onOff};
        default:
            return state;
    }
}