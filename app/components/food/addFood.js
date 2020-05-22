import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LeafHeader from '../shared/leafHeader';
import * as Actions from '../../actions';
import { TextField, TextFieldIcon, TextFieldHelperText } from '@rmwc/TextField';
import fatSecretService from '../../model/fatSecretService';
import { Button } from '@rmwc/Button';
import { LinearProgress } from '@rmwc/linear-progress';
import _ from 'underscore';
import {
    List,
    ListItem,
    ListItemPrimaryText,
    ListItemText,
    ListItemSecondaryText,
    ListItemMeta
  } from '@rmwc/list';

  import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
} from '@rmwc/dialog';

class AddFoodComponent extends React.Component {
    constructor(props) {
        super(props);
        this.setState({
            synching:false,
            selectedFood:null
        });
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.addMeal = this.addMeal.bind(this);
    }

    componentDidMount() {
        
    }

    onChange(e){
        let text = e.target.value;
        this.setState({foodDescription:text});
    }

    onSearch(){
        this.setState({synching:true});
        fatSecretService.search(this.state.foodDescription, this.props.userData.token, (error, foodList)=>{
            if(!error){
                this.setState({foodList:foodList, synching:false,error:null});
            }
            else {
                this.setState({synching:false, error:error});
            }
        });
    }

    onSelect(food){
        this.setState({
            selectedFood:food
        })
    }

    addMeal(){
        this.props.actions.addMeal(this.state.selectedFood);
        this.setState({
            gotoFood:'go'
        })
    }

    render() {
        if(this.state&&this.state.gotoFood){
            return <Redirect
                to={`/stage/food`} />
        }
        return (
            <div style={{height: '85vh', marginTop:'10px'}}>
                <LeafHeader backUrl='/stage/food'
                    title='Add food' />
                {
                    this.state&&this.state.synching ?
                        (<LinearProgress determinate={false} />) : null
                }
                <div style={{ marginTop:'5px', marginLeft: '5vw', marginRight: '5vw',  display:'flex' }}>
                    <TextField style={{marginRight:'5px'}}
                        fullwidth
                        name='Food description' 
                        label='Food description'
                        onChange={(e) => { this.onChange(e) }} />
                        <Button onClick={this.onSearch} style={{position:'relative', top:'20px'}}>Search</Button>

                </div>
                <div style={{overflow:'scroll', height:'85vh'}}>
                    {
                        this.state && this.state.error?
                        <div style={{color:'red', marginLeft:'10vw',marginTop:'5vw'}}>Error retrieving food description</div>
                        : null
                    }
                {
                    this.state && this.state.foodList ?
                        (
                            <List twoLine>
                                {
                                    this.state.foodList.map(food => {
                                        return (
                                            <ListItem key={food.food_id} onClick={()=>this.onSelect(food)}>
                                                <ListItemText>
                                                    <ListItemPrimaryText>{food.food_name}</ListItemPrimaryText>
                                                    <ListItemSecondaryText>{food.food_description}</ListItemSecondaryText>
                                                </ListItemText>
                                            </ListItem>
                                        );
                                    })
                                }
                            </List>
                        ) : null
                }
                </div>
                <Dialog open={this.state&&this.state.selectedFood}>
                        <DialogTitle>Meal</DialogTitle>
                        <DialogContent>
                            <div>{this.state && this.state.selectedFood? this.state.selectedFood.food_name:null}</div>
                        </DialogContent>
                        <DialogActions>
                            <DialogButton onClick={this.addMeal}>Add meal</DialogButton>
                            <DialogButton isDefaultAction onClick={()=>{
                                this.setState({
                                    selectedFood: null
                                });
                            }}>Cancel</DialogButton>
                        </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userData: state.userData
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const AddFood = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddFoodComponent)

export default withRouter(AddFood);