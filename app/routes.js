import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Route, Redirect, withRouter } from 'react-router-dom';
import Stage from './components/stage/component';
import SignIn from './components/signin/component';
import SignUp from './components/signup/component';
import Chat from './components/chat/chat';
import CardDetails from './components/home/cardDetails';
import * as Actions from './actions';
import MainTerms from './components/terms/main';

const RoutesComponent = (props) => {
    return (<div style={{height:'100vh', overflow:'hidden'}}>
        <Route exact path='/' render={()=>{
          return props.settingsData.termsAndConditionsAgreed?
        (<Redirect to='/stage/home/false'/>):(<Redirect to='/terms'/>)
    }}/>
        <Route path='/terms' component={MainTerms}  />
        <Route path='/stage' component={Stage}  />
        <Route path='/chat' component={Chat}  />
        <Route path='/card_details' component={CardDetails}  />
        <Route path='/signin' component={SignIn}  />
        <Route path='/signup' component={SignUp}  />
    </div>);
}

const mapStateToProps = state => {
    return { devices: state.devices, 
        measures: state.measures, 
        dialogState: state.dialogState,
        settingsData: state.settingsData 
    };
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

