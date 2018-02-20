/**
 * Created by Victor on 2/18/2016.
 */

(function() {

    "use strict";

    $.material.init();

    var ValidationInput = React.createClass({
        propTypes: {
            regexString: React.PropTypes.string,
            regex: React.PropTypes.object,
            compareTo: React.PropTypes.string,
            inputName: React.PropTypes.string.isRequired,
            inputId: React.PropTypes.string.isRequired,
            inputType: React.PropTypes.string.isRequired,
            inputLabel: React.PropTypes.string.isRequired,
            inputRequired: React.PropTypes.bool,
            validators: React.PropTypes.array,
            validatorMessages: React.PropTypes.array,
            lostFocusCallBack: React.PropTypes.func
        },
        getDefaultProps: function() {
            return {
                regexString: undefined,
                regex: undefined,
                compareTo: "",
                inputName: "validationInput",
                inputId: "validationInput",
                inputType: "text",
                inputLabel: "Validation Input",
                inputRequired: false,
                validators: [],
                validatorMessages: [],
                lostFocusCallBack: undefined
            };
        },
        getInitialState: function() {
            return {
                defaultFormGroupClassName: "form-group label-floating is-empty",
                validationMessage: ""
            }
        },
        validateComponent: function(component) {
            var componentValue = component.target.value;

            var isValid = true;

            for(var i=0; i< this.props.validators.length; i++) {
                if (this.props.validators[i] == "required") {
                    if (componentValue === "") {
                        isValid = false;
                        this.setState({
                            validationMessage: this.props.validatorMessages[i],
                            defaultFormGroupClassName: "form-group label-floating has-error is-empty is-focused " + Math.random().toString(36).slice(-5),
                        });
                        break;
                    }
                }
                else if (this.props.validators[i] == "compare") {
                    if (componentValue != this.props.compareTo) {
                        isValid = false;
                        this.setState({
                            validationMessage: this.props.validatorMessages[i],
                            defaultFormGroupClassName: "form-group label-floating has-error is-focused " + Math.random().toString(36).slice(-5),
                        });
                        break;
                    }
                }
                else if (this.props.validators[i] == "pattern") {
                    if (!this.props.regex.test(componentValue)) {
                        isValid = false;
                        this.setState({
                            validationMessage: this.props.validatorMessages[i],
                            defaultFormGroupClassName: "form-group label-floating has-error is-focused " + Math.random().toString(36).slice(-5),
                        });
                        break;
                    }
                }
            }

            if (isValid) {
                this.setState({
                    validationMessage: "",
                    defaultFormGroupClassName: "form-group label-floating " + Math.random().toString(36).slice(-5),
                });
            }
            else{
                this.setState({
                    validationMessage: this.props.validatorMessages[i],
                    defaultFormGroupClassName: "form-group label-floating has-error is-focused " + Math.random().toString(36).slice(-5),
                });
            }

            return isValid;
        },
        onChange: function(component) {
            var isValid = this.validateComponent(component);
            this.props.lostFocusCallBack(component, isValid);
        },
        onBlur: function(component) {
            var isValid = this.validateComponent(component);
            this.props.lostFocusCallBack(component, isValid);
        },
        render: function () {
            return <div className={this.state.defaultFormGroupClassName}>
                <i className="material-icons md-36">{this.props.inputIconName}</i>
                <label htmlFor={this.props.inputName} className="control-label">{this.props.inputLabel}</label>
                <input type={this.props.inputType}
                       className="form-control"
                       id={this.props.inputId}
                       name={this.props.inputName}
                       pattern={this.props.regexString}
                       required={this.props.inputRequired}
                       onChange={this.onChange}
                       onBlur={this.onBlur}/>
                <span className="help-block">{this.state.validationMessage}</span>
                <span className="material-input"></span>
            </div>
        }
    });

    var ProviderSignUp = React.createClass({
        emailOnBlur: function(component, isValid) {
            var validFields = {
                emailIsValid: isValid,
                passwordIsValid: this.state.password.isValid,
                confirmPasswordIsValid: this.state.confirmPassword.isValid,
                surnameIsValid: this.state.surname.isValid,
                givenNameIsValid: this.state.givenName.isValid,
                phoneNumberIsValid: this.state.phoneNumber.isValid
            };
            this.setState({email: {value: component.target.value, isValid: isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
        },
        passwordOnBlur: function(component, isValid) {
            var validFields = {
                emailIsValid: this.state.email.isValid,
                passwordIsValid: isValid,
                confirmPasswordIsValid: this.state.confirmPassword.isValid,
                surnameIsValid: this.state.surname.isValid,
                givenNameIsValid: this.state.givenName.isValid,
                phoneNumberIsValid: this.state.phoneNumber.isValid
            };
            this.setState({password: {value: component.target.value, isValid: isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
        },
        confirmPasswordOnBlur: function(component, isValid) {
            var validFields = {
                emailIsValid: this.state.email.isValid,
                passwordIsValid: this.state.password.isValid,
                confirmPasswordIsValid: isValid,
                surnameIsValid: this.state.surname.isValid,
                givenNameIsValid: this.state.givenName.isValid,
                phoneNumberIsValid: this.state.phoneNumber.isValid
            };
            this.setState({confirmPassword: {value: component.target.value, isValid: isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
        },
        surnameOnBlur: function(component, isValid) {
            var validFields = {
                emailIsValid: this.state.email.isValid,
                passwordIsValid: this.state.password.isValid,
                confirmPasswordIsValid: this.state.confirmPassword.isValid,
                surnameIsValid: isValid,
                givenNameIsValid: this.state.givenName.isValid,
                phoneNumberIsValid: this.state.phoneNumber.isValid
            };
            this.setState({surname: {value: component.target.value, isValid: isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
        },
        givenNameOnBlur: function(component, isValid) {
            var validFields = {
                emailIsValid: this.state.email.isValid,
                passwordIsValid: this.state.password.isValid,
                confirmPasswordIsValid: this.state.confirmPassword.isValid,
                surnameIsValid: this.state.surname.isValid,
                givenNameIsValid: isValid,
                phoneNumberIsValid: this.state.phoneNumber.isValid
            };
            this.setState({givenName: {value: component.target.value, isValid: isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
        },
        phoneNumberOnBlur: function(component, isValid) {
            var validFields = {
                emailIsValid: this.state.email.isValid,
                passwordIsValid: this.state.password.isValid,
                confirmPasswordIsValid: this.state.confirmPassword.isValid,
                surnameIsValid: this.state.surname.isValid,
                givenNameIsValid: this.state.givenName.isValid,
                phoneNumberIsValid: isValid
            };
            this.setState({phoneNumber: {value: component.target.value, isValid: isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
        },
        getInitialState: function() {
            return {
                email: {value: "", isValid: false},
                password: {value: "", isValid: false},
                confirmPassword: {value: "", isValid: false},
                surname: {value: "", isValid: false},
                givenName: {value: "", isValid: false},
                phoneNumber: {value: "", isValid: false},
                canSubmitForm: false
            }
        },
        changeCanSubmit: function(validFields) {
            var canSubmit = validFields.emailIsValid
                && validFields.passwordIsValid
                &&  validFields.confirmPasswordIsValid
                &&  validFields.surnameIsValid
                &&  validFields.givenNameIsValid
                &&  validFields.phoneNumberIsValid;

            return canSubmit;
        },
        handleSubmit: function(event) {
            event.preventDefault();
            var signUpFormData = {
                email: this.state.email.value,
                password: this.state.password.value,
                confirmPassword: this.state.confirmPassword.value,
                type: "provider",
                name: this.state.surname.value,
                surname: this.state.givenName.value,
                phone: this.state.phoneNumber.value,
                agent: "mobile"
            };

            Bridge.providerSignUp(signUpFormData, function(result) {
                if (result.success) {
                  Bridge.Redirect.redirectToSignIn(result.data.email);
                }
                else {
                    Bridge.error(result, function() {});
                }
            });
        },
        componentDidUpdate: function() {
        },
        render: function () {
            return <form name="signUpForm" onSubmit={this.handleSubmit}>
                <ValidationInput inputLabel="Email"
                                 inputIconName="email"
                                 inputType="email"
                                 inputName="userEmail"
                                 inputId="userEmail"
                                 inputRequired={true}
                                 lostFocusCallBack={this.emailOnBlur}
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
                                 lostFocusCallBack={this.passwordOnBlur}
                                 regexString="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})"
                                 regex={/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})$/}
                                 validators={["required", "pattern"]}
                                 validatorMessages={["Password is required.", "At least one number, one lowercase, one uppercase letter and at least six characters."]} />
                <ValidationInput inputLabel="Confirm Password"
                                 inputIconName="https"
                                 inputType="password"
                                 inputName="userConfirmPassword"
                                 inputId="userConfirmPassword"
                                 inputRequired={true}
                                 lostFocusCallBack={this.confirmPasswordOnBlur}
                                 regexString="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})"
                                 regex={/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})$/}
                                 compareTo={this.state.password.value}
                                 validators={["required", "compare", "pattern"]}
                                 validatorMessages={["Confirm Password is required.", "Must match password from previous entry.", "At least one number, one lowercase, one uppercase letter and at least six characters."]} />
                <ValidationInput inputLabel="Surname"
                                 inputIconName="person"
                                 inputType="text"
                                 inputName="userSurname"
                                 inputId="userSurname"
                                 inputRequired={true}
                                 lostFocusCallBack={this.surnameOnBlur}
                                 validators={["required"]}
                                 validatorMessages={["Surname is required."]} />
                <ValidationInput inputLabel="Given name"
                                 inputIconName="person"
                                 inputType="text"
                                 inputName="givenNameSurname"
                                 inputId="givenNameSurname"
                                 inputRequired={true}
                                 lostFocusCallBack={this.givenNameOnBlur}
                                 validators={["required"]}
                                 validatorMessages={["Given Name is required."]} />
                <ValidationInput inputLabel="Mobile"
                                 inputIconName="phone"
                                 inputType="text"
                                 inputName="phoneNumber"
                                 inputId="phoneNumber"
                                 inputRequired={true}
                                 lostFocusCallBack={this.phoneNumberOnBlur}
                                 regexString="(((\+44\s?|0044\s?)?|(\(?0))((2[03489]\)?\s?\d{4}\s?\d{4})|(1[23456789]1\)?\s?\d{3}\s?\d{4})|(1[23456789][234578][0234679]\)?\s?\d{6})|(1[2579][0245][0467]\)?\s?\d{5})|(11[345678]\)?\s?\d{3}\s?\d{4})|(1[35679][234689]\s?[46789][234567]\)?\s?\d{4,5})|([389]\d{2}\s?\d{3}\s?\d{4})|([57][0-9]\s?\d{4}\s?\d{4})|(500\s?\d{6})|(7[456789]\d{2}\s?\d{6})))"
                                 regex={/^(((\+44\s?|0044\s?)?|(\(?0))((2[03489]\)?\s?\d{4}\s?\d{4})|(1[23456789]1\)?\s?\d{3}\s?\d{4})|(1[23456789][234578][0234679]\)?\s?\d{6})|(1[2579][0245][0467]\)?\s?\d{5})|(11[345678]\)?\s?\d{3}\s?\d{4})|(1[35679][234689]\s?[46789][234567]\)?\s?\d{4,5})|([389]\d{2}\s?\d{3}\s?\d{4})|([57][0-9]\s?\d{4}\s?\d{4})|(500\s?\d{6})|(7[456789]\d{2}\s?\d{6})))$/}
                                 validators={["required", "pattern"]}
                                 validatorMessages={["Mobile is required.", "Mobile number is not valid."]} />
                <div className="form-actions">
                    <button type="submit" href="javascript:void(0);" className="btn btn-raised btn-info" disabled={!this.state.canSubmitForm}>Register</button>
                </div>
            </form>
        }
    });

    ReactDOM.render(<ProviderSignUp />, document.getElementById("providerSignUpForm"));
})();
