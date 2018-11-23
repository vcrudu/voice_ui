export const TOGGLE_SOUND = 'TOGGLE_SOUND';
export const ADD_DEVICE = 'ADD_DEVICE';
export const ADD_MEASURE = 'ADD_MEASURE';
export const CHANGE_DIALOG_STATE = 'CHANGE_VOICE_STATE';
export const ADD_MEASURE_COUNT = 'ADD_MEASURE_COUNT';
export const SWITCH_MICROPHONE = 'SWITCH_MICROPHONE';
export const SIGN_OUT = 'LOG_OUT';
export const SIGN_IN = 'SIGN_IN';
export const CURRENT_ACTION = 'CURRENT_ACTION';
export const PAIR_ACTION = 'PAIR_ACTION';
export const ADD_CHAT_MESSAGE = 'ADD_CHAT_MESSAGE';
export const CLEAR_CHAT_MESSAGE = 'CLEAR_CHAT_MESSAGE';
export const CHANGE_SCREEN_TITLE = 'CHANGE_SCREEN_TITLE';
export const UPDATE_SETTINGS_DATA = 'UPDATE_SETTINGS_DATA';
export const REMOVE_CURRENT_ACTION = 'REMOVE_CURRENT_ACTION';
export const CURRENT_CHAT_COMMAND = 'CURRENT_CHAT_COMMAND';

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

export const switchMicrophone = (onOff) => ({
    type: SWITCH_MICROPHONE,
    onOff
});

export const signInOut = (userData) => ({
    type: userData ? SIGN_IN : SIGN_OUT,
    userData: userData
});

export const setCurrentAction = (card) => ({
    type: CURRENT_ACTION,
    currentAction: card
});

export const setCurrentChatCommand = (command) => ({
    type: CURRENT_CHAT_COMMAND,
    currentChatCommand: command
});

export const removeCurrentAction = () => ({
    type: REMOVE_CURRENT_ACTION
});

export const pairDevice = () => ({
    type: PAIR_ACTION
});

export const addChatMessage = (message) => ({
    type: ADD_CHAT_MESSAGE,
    message: message
});

export const clearChatMessage = () => ({
    type: CLEAR_CHAT_MESSAGE,
    message: message
});

export const changeScreenTitle = (title) => ({
    type: CHANGE_SCREEN_TITLE,
    title: title
});

export const updateSettingsData = (settingName, value) => ({
    type: UPDATE_SETTINGS_DATA,
    settingName: settingName,
    value: value
});