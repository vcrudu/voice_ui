import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions';

import { Fab } from '@rmwc/Fab';

  import _ from 'underscore';
  import moment from 'moment';

  import {
    Card,
    CardPrimaryAction,
    ListDivider
} from '@rmwc/Card';

import { Typography } from '@rmwc/Typography';

class FoodComponent extends React.Component {
    constructor(props){
        super(props);
        this.onFabClick = this.onFabClick.bind(this);
        this.state = { addFood: null };
        this.props.actions.changeScreenTitle('My Food');
        this.getMeals = this.getMeals.bind(this);
    }

    onFabClick(){
        this.setState({ addFood: 'go' });
    }

    getMeals(){
        let array = Object.keys(this.props.meals).map(mealKey=>{
            return {time: moment(mealKey, 'DDMMYYYYHHmmss'), meal:this.props.meals[mealKey]};
        });

        let result =  _.sortBy(array, (meal)=>{
            return (-1) * meal.time.valueOf();
        });

        result = result.filter((meal)=>meal.time.isValid());

        return result;
    }

    render(){
        if(this.state.addFood){
            return <Redirect
                to={`/add_food`} />
        }
        return <div>
            {
                    this.props.meals ?
                        (
                            <Card outlined>
                                {
                                    this.getMeals().map(food => {
                                        let meal = food.meal;
                                        return (<div>
                                                <CardPrimaryAction key={meal.food_id}>
                                                        <div style={{ padding: '1rem' }}>
                                                        <Typography use="headline5" tag="div">
                                                        {meal.food_name}
                                                        </Typography>
                                                        <Typography use="body1" tag="p" theme="textSecondaryOnBackground">
                                                        {meal.food_description}
                                                        </Typography>
                                                        <Typography use="caption" tag="div">
                                                        {food.time.format('LLL')}
                                                        </Typography>
                                                        </div>
                                                </CardPrimaryAction>
                                            </div>);
                                    })
                                }
                            </Card>
                        ) : null
                }
            <Fab style={{ position: 'fixed', bottom: '15vh', right: '5vh' }} icon='add'
                        onClick={() => {
                            this.onFabClick();
                        }}
                    ></Fab>
        </div>;
    }
}


const mapStateToProps = state => {
    return {
        ...state,
        userData: state.userData,
        currentAction: state.currentAction,
        meals: state.meals
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const Food = connect(
    mapStateToProps,
    mapDispatchToProps
)(FoodComponent)

export default withRouter(Food);