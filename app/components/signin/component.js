import React from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';
import { Button } from 'rmwc/Button';
import LoggedOutHeader from '../shared/loggedOutHeader';
import { Grid, GridCell } from 'rmwc/Grid';
import apiService from '../../model/apiService';
import ValidationInput from '../shared/ValidationInput';
import Stage from '../stage/component';
import SecurityStorage from '../../model/SecurityStorage'
import * as Actions from '../../actions'
import APP_SETTINGS from '../../constants/appSettings';
import io from 'socket.io-client';

class SignInComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {width:'80vw',margin:'20vh auto'};
        this.state = {
            email: { value: "vcrudu@hotmail.com", isValid: false },
            password: { value: "Test1234", isValid: false },
            confirmPassword: { value: "", isValid: false },
            surname: { value: "", isValid: false },
            givenName: { value: "", isValid: false },
            phoneNumber: { value: "", isValid: false },
            canSubmitForm: false,
            style:{width:'80vw',margin:'20vh auto'}
        }
        this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
        this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
    }

    onKeyboardDidShow(){
        this.setState({style:{width:'80vw',margin:'10vh auto'}});
    }

    onKeyboardDidHide(){
        this.setState({style:{width:'80vw',margin:'20vh auto'}});
    }

    componentDidMount(){
        window.addEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.addEventListener('keyboardDidHide', this.onKeyboardDidHide);
    }

    componentWillUnmount(){
        window.removeEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.removeEventListener('keyboardDidHide', this.onKeyboardDidHide);
    }

    emailOnBlur(component, isValid) {
        var validFields = {
            emailIsValid: isValid,
            passwordIsValid: this.state.password.isValid
        };
        this.setState({ email: { value: component.target.value, isValid: isValid }, canSubmitForm: this.changeCanSubmit(validFields) });
    }

    passwordOnBlur(component, isValid) {
        var validFields = {
            emailIsValid: this.state.email.isValid,
            passwordIsValid: isValid
        };
        this.setState({ password: { value: component.target.value, isValid: isValid }, canSubmitForm: this.changeCanSubmit(validFields) });
    }

    changeCanSubmit(validFields) {
        var canSubmit = validFields.emailIsValid
            && validFields.passwordIsValid;

        return canSubmit;
    }

    handleSubmit(event) {
        var canSubmit = this.state.email.isValid
            && this.state.password.isValid;

        if (!canSubmit) { return false; }

        var signUpFormData = {
            email: this.state.email.value,
            password: this.state.password.value
        };

        apiService.signIn(signUpFormData, (response) => {
            if (response.success) {
                const securityStorage = new SecurityStorage();
                securityStorage.setValue('token', response.data.token);
                this.props.actions.signInOut(response.data);
                console.log(APP_SETTINGS.serverUrl);
                window.socket = io(APP_SETTINGS.serverUrl);
                window.socket.on('connect', function () {
                    window.socket.emit('authenticate', { token: response.data.token });
                    window.socket.on('disconnect', function (reason) {
                        console.log('socket disconnect:'+reason)
                    });
                });
            }
            else {
                apiService.error(response, () => { });
            }
        });
    }

    render(){
        return (this.props.userData&&this.props.userData.token)?(<Redirect to="/stage/home/false"/>):
        (
            <div>
                <LoggedOutHeader/>
                <div style={this.state.style}>
                     <div>
                     <ValidationInput inputLabel="Email"
                        inputIconName="email"
                        inputType="email"
                        inputName="userEmail"
                        inputId="userEmail"
                        inputRequired={true}
                        lostFocusCallBack={(component, isValid)=>{this.emailOnBlur(component, isValid)}}
                        regexString="[A-Za-z0-9._%+-]{3,}@[a-zA-Z_-]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})"
                        regex={/^[A-Za-z0-9._%+-]{3,}@[a-zA-Z_-]{3,}([.][a-zA-Z]{2,}|[.][a-zA-Z]{2,}[.][a-zA-Z]{2,})$/}
                        validators={["required", "pattern"]}
                        validatorMessages={["Email is required.", "Your email must look like an e-mail address."]} />
                    <ValidationInput inputLabel="Password"
                        inputIconName="https"
                        inputType="password"
                        inputName="userPassword"
                        inputId="userPassword"
                        inputRequired={true}
                        lostFocusCallBack={(component, isValid)=>{this.passwordOnBlur(component, isValid)}}
                        regexString="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})"
                        regex={/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})$/}
                        validators={["required", "pattern"]}
                        validatorMessages={["Password is required.", "At least one number, one lowercase, one uppercase letter and at least six characters."]} />
                    </div>
                    <Grid>
                        <GridCell phone="2">
                            <Link to='/'>
                                <Button style={{ width: '100%' }}>Cancel</Button>
                            </Link>
                        </GridCell>
                        <GridCell phone="2">
                            <Button style={{ width: '100%' }} onClick={()=>{this.handleSubmit()}}>Sign In</Button>
                        </GridCell>
                    </Grid>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { userData: state.userData};
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const SignIn = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignInComponent)

export default withRouter(SignIn);