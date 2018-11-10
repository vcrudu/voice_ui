import {ADD_CHAT_MESSAGE} from '../actions';
import {CLEAR_CHAT_MESSAGE} from '../actions';

export const chatState = (state=[], action)=>{
    switch(action.type){
        case ADD_CHAT_MESSAGE:
        return state.concat([action.message]);
        case CLEAR_CHAT_MESSAGE:
        return [];
        default:
        return state;
    }
}