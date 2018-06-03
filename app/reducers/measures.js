import {ADD_MEASURE} from '../actions';

export const measures = (state=[], action)=>{
    switch(action.type){
        case ADD_MEASURE:
        return state.concat(action.measure);
        default:
        return state;
    }
}