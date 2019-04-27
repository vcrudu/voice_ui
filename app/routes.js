import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Route, Redirect, withRouter } from 'react-router-dom';
import Stage from './components/stage/component';
import SignIn from './components/signin/component';
import SignUp from './components/signup/component';
import Chat from './components/chat/chat';
import Voice from './components/voice/component';
import * as Actions from './actions';
import MainTerms from './components/terms/main';
import Bp from './components/vital-signs/bp';
import Exercise from './components/vital-signs/exercise';
import Weight from './components/vital-signs/weight';
import Temperature from './components/vital-signs/temperature';
import SymptomsHistory from './components/vital-signs/symptomsHistory';
import MedicationHistory from './components/vital-signs/medicationHistory';
import GuestSymptomateWithHeader from './components/symptoms/guestSymptomateWithHeader';
import Distance from './components/vital-signs/distance';

const RoutesComponent = (props) => {
    return (<div style={{height:'100vh', overflow:'hidden'}}>
        <Route exact path='/' render={()=>{
          return props.settingsData.termsAndConditionsAgreed?
        (<Redirect to='/stage/home/false'/>):(<Redirect to='/terms'/>)
    }}/>
        <Route path='/terms' component={MainTerms}  />
        <Route path='/stage' component={Stage}  />
        <Route path='/chat/:backScreen/:scenarioId/:dateTime/:scenarioTitle' component={Chat}  />
        <Route path='/voice/:backScreen/:scenarioId/:dateTime/:scenarioTitle' component={Voice}  />
        <Route path='/bp' component={Bp}  />
        <Route path='/exercise' component={Exercise}  />
        <Route path='/distance' component={Distance}  />
        <Route path='/temperature' component={Temperature}  />
        <Route path='/symptoms_history' component={SymptomsHistory}  />
        <Route path='/medication_history' component={MedicationHistory}  />
        <Route path='/weight' component={Weight}  />
        <Route path='/signin' component={SignIn}  />
        <Route path='/signup' component={SignUp}  />
        <Route path='/guest_symptoms' component={GuestSymptomateWithHeader}  />
    </div>);
}

const mapStateToProps = state => {
    return { devices: state.devices, 
        measures: state.measures, 
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

