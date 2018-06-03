import React, { Component } from 'react';
import { Button } from 'rmwc/Button';
import LoggedOutHeader from '../shared/loggedOutHeader';
import { Grid, GridCell } from 'rmwc/Grid';
import {Link, Redirect, withRouter} from 'react-router-dom';
import ValidationInput from '../shared/ValidationInput';
import apiService from '../../model/apiService'; 

class PatientSignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
                email: { value: "", isValid: false },
                password: { value: "", isValid: false },
                confirmPassword: { value: "", isValid: false },
                surname: { value: "", isValid: false },
                givenName: { value: "", isValid: false },
                phoneNumber: { value: "", isValid: false },
                canSubmitForm: false
        }
    }

    emailOnBlur(component, isValid) {
        var validFields = {
            emailIsValid: isValid,
            passwordIsValid: this.state.password.isValid,
            confirmPasswordIsValid: this.state.confirmPassword.isValid,
            surnameIsValid: this.state.surname.isValid,
            givenNameIsValid: this.state.givenName.isValid,
            phoneNumberIsValid: this.state.surname.isValid
        };
        this.setState({ email: { value: component.target.value, isValid: isValid }, canSubmitForm: this.changeCanSubmit(validFields) });
    }

    passwordOnBlur(component, isValid) {
        var validFields = {
            emailIsValid: this.state.email.isValid,
            passwordIsValid: isValid,
            confirmPasswordIsValid: this.state.confirmPassword.isValid,
            surnameIsValid: this.state.surname.isValid,
            givenNameIsValid: this.state.givenName.isValid,
            phoneNumberIsValid: this.state.surname.isValid
        };
        this.setState({ password: { value: component.target.value, isValid: isValid }, canSubmitForm: this.changeCanSubmit(validFields) });
    }

    confirmPasswordOnBlur(component, isValid) {
        var validFields = {
            emailIsValid: this.state.email.isValid,
            passwordIsValid: this.state.password.isValid,
            confirmPasswordIsValid: isValid,
            surnameIsValid: this.state.surname.isValid,
            givenNameIsValid: this.state.givenName.isValid
        };
        this.setState({ confirmPassword: { value: component.target.value, isValid: isValid }, canSubmitForm: this.changeCanSubmit(validFields) });
    }

    surnameOnBlur(component, isValid) {
        var validFields = {
            emailIsValid: this.state.email.isValid,
            passwordIsValid: this.state.password.isValid,
            confirmPasswordIsValid: this.state.confirmPassword.isValid,
            surnameIsValid: isValid,
            givenNameIsValid: this.state.givenName.isValid,
            phoneNumberIsValid: this.state.surname.isValid
        };
        this.setState({ surname: { value: component.target.value, isValid: isValid }, canSubmitForm: this.changeCanSubmit(validFields) });
    }

    givenNameOnBlur(component, isValid) {
        var validFields = {
            emailIsValid: this.state.email.isValid,
            passwordIsValid: this.state.password.isValid,
            confirmPasswordIsValid: this.state.confirmPassword.isValid,
            surnameIsValid: this.state.surname.isValid,
            givenNameIsValid: isValid,
            phoneNumberIsValid: this.state.phoneNumber.isValid
        };
        this.setState({ givenName: { value: component.target.value, isValid: isValid }, canSubmitForm: this.changeCanSubmit(validFields) });
    }

    phoneNumberOnBlur(component, isValid) {
        var validFields = {
            emailIsValid: this.state.email.isValid,
            passwordIsValid: this.state.password.isValid,
            confirmPasswordIsValid: this.state.confirmPassword.isValid,
            surnameIsValid: this.state.surname.isValid,
            givenNameIsValid: this.state.givenName.isValid,
            phoneNumberIsValid: isValid
        };
        this.setState({ phoneNumber: { value: component.target.value, isValid: isValid }, canSubmitForm: this.changeCanSubmit(validFields) });
    }

    changeCanSubmit(validFields) {
        var canSubmit = validFields.emailIsValid
            && validFields.passwordIsValid
            && validFields.confirmPasswordIsValid
            && validFields.surnameIsValid
            && validFields.givenNameIsValid
            && validFields.phoneNumberIsValid;

        return canSubmit;
    }

    handleSubmit(event) {
        var canSubmit = this.state.email.isValid
            && this.state.password.isValid
            && this.state.surname.isValid
            && this.state.givenName.isValid
            && this.state.phoneNumber.isValid;

        if (!canSubmit) { return false; }

        var signUpFormData = {
            email: this.state.email.value,
            password: this.state.password.value,
            confirmPassword: this.state.confirmPassword.value,
            type: "patient",
            name: this.state.surname.value,
            surname: this.state.givenName.value,
            phone: this.state.phoneNumber.value,
            agent: "mobile"
        };

        apiService.signUp(signUpFormData, (result) => {
            if (result.success) {
                this.setState({successSubmit:true});
                apiService.sendEvent(result.data.token, result.data.email, {"event_name": "sign_up"}, 10000);    
            }
            else {
                apiService.error(result, () => { });
            }
        });
    }

    render() {
        return this.state.successSubmit?(<Redirect to='/signin' />):
            (<div>
                <LoggedOutHeader />
                <div style={{width:'80vw',margin:'0 auto', height:'90vh', overflowY:'scroll'}}>
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
                    <ValidationInput inputLabel="First name"
                        inputIconName="person"
                        inputType="text"
                        inputName="givenNameSurname"
                        inputId="givenNameSurname"
                        inputRequired={true}
                        lostFocusCallBack={(component, isValid)=>{this.givenNameOnBlur(component, isValid)}}
                        validators={["required"]}
                        validatorMessages={["First name is required."]} />
                    <ValidationInput inputLabel="Last name"
                        inputIconName="person"
                        inputType="text"
                        inputName="userSurname"
                        inputId="userSurname"
                        inputRequired={true}
                        lostFocusCallBack={(component, isValid)=>{this.surnameOnBlur(component, isValid)}}
                        validators={["required"]}
                        validatorMessages={["Last name is required."]} />
                    <ValidationInput inputLabel="Mobile"
                        inputIconName="phone"
                        inputType="text"
                        inputName="phoneNumber"
                        inputId="phoneNumber"
                        inputRequired={true}
                        lostFocusCallBack={(component, isValid)=>{this.phoneNumberOnBlur(component, isValid)}}
                        regexString="(((\+44\s?|0044\s?)?|(\(?0))((2[03489]\)?\s?\d{4}\s?\d{4})|(1[23456789]1\)?\s?\d{3}\s?\d{4})|(1[23456789][234578][0234679]\)?\s?\d{6})|(1[2579][0245][0467]\)?\s?\d{5})|(11[345678]\)?\s?\d{3}\s?\d{4})|(1[35679][234689]\s?[46789][234567]\)?\s?\d{4,5})|([389]\d{2}\s?\d{3}\s?\d{4})|([57][0-9]\s?\d{4}\s?\d{4})|(500\s?\d{6})|(7[456789]\d{2}\s?\d{6})))"
                        regex={/^(((\+44\s?|0044\s?)?|(\(?0))((2[03489]\)?\s?\d{4}\s?\d{4})|(1[23456789]1\)?\s?\d{3}\s?\d{4})|(1[23456789][234578][0234679]\)?\s?\d{6})|(1[2579][0245][0467]\)?\s?\d{5})|(11[345678]\)?\s?\d{3}\s?\d{4})|(1[35679][234689]\s?[46789][234567]\)?\s?\d{4,5})|([389]\d{2}\s?\d{3}\s?\d{4})|([57][0-9]\s?\d{4}\s?\d{4})|(500\s?\d{6})|(7[456789]\d{2}\s?\d{6})))$/}
                        validators={["required", "pattern"]}
                        validatorMessages={["Mobile is required.", "Mobile number is not valid."]} />
                    <div>
                    <Grid>
                        <GridCell phone="2">
                            <Link to='/'>
                                <Button style={{ width: '100%' }}>Cancel</Button>
                            </Link>
                        </GridCell>
                        <GridCell phone="2">
                            <Button style={{ width: '100%' }} onClick={(e) => { this.handleSubmit(e) }}>Submit</Button>                        
                        </GridCell>
                    </Grid>
                    </div>
                </div>
            </div>);
    }
}

export default PatientSignUp;