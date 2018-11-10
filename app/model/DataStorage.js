import APP_SETTINGS from '../constants/appSettings';

class DataStorage {
    saveItem(key, value) {
        const serializedValue = JSON.stringify(value);
        window.localStorage.setItem(key, serializedValue);
    }

    getItem(key) {
        const value = window.localStorage.getItem(key);
        if(value)
        return JSON.parse(value);
        else return undefined;
    }

    removeItem(key) {
        window.localStorage.removeItem(key);
    }

    saveState(state){
        this.saveItem(APP_SETTINGS.stateKey, state)
    }

    deleteState(){
        this.removeItem(APP_SETTINGS.stateKey)
    }

    loadState(){
        const state = this.getItem(APP_SETTINGS.stateKey);
        if(state)
        return state;
        else return {
            voiceState:{voiceState:'on', microphoneState:'on'},
            devices:[],
            dialogState:{title:"PASSIVE"}
        }
    }
}

const dataStorage = new DataStorage();

export default dataStorage;