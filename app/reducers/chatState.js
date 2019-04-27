import {ADD_CHAT_MESSAGE} from '../actions';
import {CLEAR_CHAT_MESSAGE} from '../actions';

export const chatState = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case ADD_CHAT_MESSAGE:
            newState = { ...state };
            newState[action.message.patientCardId] = 
            (newState[action.message.patientCardId]?
                newState[action.message.patientCardId].concat([action.message]):
                [].concat([action.message]))
            return newState;
        case CLEAR_CHAT_MESSAGE:
            newState = { ...state };
            newState[action.cardId]=[];
            return newState;
        default:
            return state;
    }
}