import React from 'react';
import { Route } from 'react-router-dom';
import Stage from './components/stage/component';
import SignIn from './components/signin/component';
import SignUp from './components/signup/component';

const RoutesComponent = () => {
    return (<div style={{height:'100vh', overflow:'hidden'}}>
        <Route exact path='/' component={Stage}/>
        <Route path='/signin' component={SignIn}  />
        <Route path='/signup' component={SignUp}  />
    </div>);
}

export default RoutesComponent;

