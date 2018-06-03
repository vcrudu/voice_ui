export const TOGGLE_SOUND = 'TOGGLE_SOUND';
export const ADD_DEVICE = 'ADD_DEVICE';
export const ADD_MEASURE = 'ADD_MEASURE';
export const CHANGE_DIALOG_STATE = 'CHANGE_VOICE_STATE';
export const ADD_MEASURE_COUNT = 'ADD_MEASURE_COUNT';
export const CLICK_MICROPHONE = 'CLICK_MICROPHONE';
export const SIGN_OUT = 'LOG_OUT';
export const SIGN_IN = 'SIGN_IN';
export const CURRENT_ACTION = 'CURRENT_ACTION';

export const toggleSound = (onOff) => ({
    type: TOGGLE_SOUND,
    onOff
});

export const addDevice = (device) => ({
    type: ADD_DEVICE,
    device: device
});

export const addMeasure = (measure) => ({
    type: ADD_MEASURE,
    measure: measure
});

export const changeDialogState = (dialogState) => ({
    type: CHANGE_DIALOG_STATE,
    dialogState: dialogState
});

export const addMeasureCount = () => ({
    type: ADD_MEASURE_COUNT
});

export const clickMicrophone = () => ({
    type: CLICK_MICROPHONE
});

export const signInOut = (userData) => ({
    type: userData ? SIGN_IN : SIGN_OUT,
    userData: userData
});

export const setCurrentAction = (message) => ({
    type: CURRENT_ACTION,
    currentAction: message
});