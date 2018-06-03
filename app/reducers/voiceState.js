import { TOGGLE_SOUND } from '../actions';
import { CLICK_MICROPHONE } from '../actions';

const initialState = {
    voiceOn: true,
    microphoneOn: false
}

export const voiceState = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_SOUND:
            return { ...state, voiceOn: action.onOff };
        case CLICK_MICROPHONE:
            return { ...state, microphoneOn: !state.microphoneOn};
        default:
            return state;
    }
}