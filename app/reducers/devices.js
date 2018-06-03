import {ADD_DEVICE} from '../actions';

export const devices = (state=[], action)=>{
    switch(action.type){
        case ADD_DEVICE:
        return state.concat(action.device);
        default:
        return state;
    }
}