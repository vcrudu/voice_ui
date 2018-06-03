import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Route, Redirect, withRouter } from 'react-router-dom';
import Stage from './components/stage/component';
import SignIn from './components/signin/component';
import SignUp from './components/signup/component';
import * as Actions from './actions';

const RoutesComponent = (props) => {
    return (<div style={{height:'100vh', overflow:'hidden'}}>
        <Route exact path='/' render={()=><Redirect to='/stage/home/false'/>}/>
        <Route path='/stage' component={Stage}  />
        <Route path='/signin' component={SignIn}  />
        <Route path='/signup' component={SignUp}  />
    </div>);
}

const mapStateToProps = state => {
    return { devices: state.devices, measures: state.measures, dialogState: state.dialogState };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const Routes = connect(
    mapStateToProps,
    mapDispatchToProps
)(RoutesComponent)

export default withRouter(Routes);

