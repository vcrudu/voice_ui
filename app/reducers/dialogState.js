import {CHANGE_DIALOG_STATE} from '../actions';

export const dialogState = (state={title:"PASSIVE"}, action)=>{
    switch(action.type){
        case CHANGE_DIALOG_STATE:
        return {...state, title:action.dialogState};
        default:
        return state;
    }
}