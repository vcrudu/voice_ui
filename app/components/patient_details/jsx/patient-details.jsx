/**
 * Created by Victor on 2/18/2016.
 */

(function() {

    "use strict";

    $.material.init();

    var ValidationDateOfBath = React.createClass({
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
            lostFocusCallBack: React.PropTypes.func,
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
            this.validateComponent(component);
        },
        onBlur: function(component) {
            var isValid = this.validateComponent(component);
            this.props.lostFocusCallBack(component, isValid);
        },
        render: function () {
            return <div className={this.state.defaultFormGroupClassName}>
                <i className="material-icons md-36 ">{this.props.inputIconName}</i>
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
            lostFocusCallBack: React.PropTypes.func,
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
            this.validateComponent(component);
        },
        onBlur: function(component) {
            var isValid = this.validateComponent(component);
            this.props.lostFocusCallBack(component, isValid);
        },
        render: function () {
            return <div className={this.state.defaultFormGroupClassName}>
                <i className="material-icons md-36 ">{this.props.inputIconName}</i>
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



    var PatientDetails = React.createClass({
       /* emailOnBlur: function(component, isValid) {
            var validFields = {
                emailIsValid: isValid,
                passwordIsValid: this.state.password.isValid,
                confirmPasswordIsValid: this.state.confirmPassword.isValid,
                surnameIsValid: this.state.surname.isValid,
                givenNameIsValid: this.state.givenName.isValid
            };
            this.setState({email: {value: component.target.value, isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
        },
        passwordOnBlur: function(component, isValid) {
            var validFields = {
                emailIsValid: this.state.email.isValid,
                passwordIsValid: isValid,
                confirmPasswordIsValid: this.state.confirmPassword.isValid,
                surnameIsValid: this.state.surname.isValid,
                givenNameIsValid: this.state.givenName.isValid
            };
            this.setState({password: {value: component.target.value, isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
        },
        confirmPasswordOnBlur: function(component, isValid) {
            var validFields = {
                emailIsValid: this.state.email.isValid,
                passwordIsValid: this.state.password.isValid,
                confirmPasswordIsValid: isValid,
                surnameIsValid: this.state.surname.isValid,
                givenNameIsValid: this.state.givenName.isValid
            };
            this.setState({confirmPassword: {value: component.target.value, isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
        },
        surnameOnBlur: function(component, isValid) {
            var validFields = {
                emailIsValid: this.state.email.isValid,
                passwordIsValid: this.state.password.isValid,
                confirmPasswordIsValid: this.state.confirmPassword.isValid,
                surnameIsValid: isValid,
                givenNameIsValid: this.state.givenName.isValid
            };
            this.setState({surname: {value: component.target.value, isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
        },
        givenNameOnBlur: function(component, isValid) {
            var validFields = {
                emailIsValid: this.state.email.isValid,
                passwordIsValid: this.state.password.isValid,
                confirmPasswordIsValid: this.state.confirmPassword.isValid,
                surnameIsValid: this.state.surname.isValid,
                givenNameIsValid: isValid
            };
            this.setState({givenName: {value: component.target.value, isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
        },*/
        getInitialState: function() {
            return {
                dateOfBath: {value: "", isValid: false},
                gender: {value: "", isValid: false},
                weight: {value: "", isValid: false},
                height: {value: "", isValid: false}

            }
        },
        changeCanSubmit: function(validFields) {
            var canSubmit = validFields.dateOfBath
                && validFields.gender
                &&  validFields.weight
                &&  validFields.height;

            return canSubmit;
        },
        handleSubmit: function(event) {
            event.preventDefault();
            var patientDetailsFormData = {
                dateOfBath: this.state.dateOfBath.value,
                gender: this.state.gender.value,
                weight: this.state.weight.value,
                height: this.state.height.value
            };

            //Add details to patient

            /*Bridge.signUp(patientDetailsFormData, function(result) {
                if (result.success) {
                    Bridge.Redirect.redirectToSignIn(result.data.email);
                }
                else {
                    Bridge.error(result, function() {});
                }
            });*/
        },

        componentDidMount : function(){
            var currYear = new Date().getFullYear();

            $('#inputDateOfBath').mobiscroll().date({
                theme: 'mobiscroll',
                display: 'bottom',
                defaultValue: new Date(new Date().setFullYear(currYear - 20)),
                maxDate: new Date(),
                minDate: new Date(new Date().setFullYear(currYear - 120))
            });

            $('#inputGender').mobiscroll().select({
                theme: 'mobiscroll',
                display: 'bottom',
                minWidth: 200
            });

            $('#inputWeight').mobiscroll().number({
                theme: 'mobiscroll',
                display: 'bottom',
                maxWidth: 100
            });

            $('#inputHeight').mobiscroll().number({
                theme: 'mobiscroll',
                display: 'bottom',
                maxWidth: 100
            });
        },

        render: function () {
            return <form name="DetailsForm" onSubmit={this.handleSubmit}>

                <div className="form-group label-floating is-empty">
                    <i className="material-icons md-36 ">person</i>
                    <label htmlFor="inputDateOfBath" className="control-label">Date of bath</label>
                    <input className="form-control"
                           id="inputDateOfBath"
                           required
                        />
                </div>


                <div className="form-group label-floating is-empty">
                    <i className="material-icons md-36 ">person</i>
                    <label htmlFor="inputGender" className="control-label">Gender</label>
                    <select className="form-control" name="Gender" id="inputGender">
                        <option value="4"></option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                        <option value="3">Unknown</option>
                    </select>

                </div>
                <div className="form-group label-floating is-empty">
                    <i className="material-icons md-36 ">person</i>
                    <label htmlFor="inputWeight" className="control-label">Weight</label>
                    <input className="form-control"
                           id="inputWeight"
                           name={this.props.inputName}
                           onChange={this.onChange}
                           onBlur={this.onBlur}/>
                </div>
                <div className="form-group label-floating is-empty">
                    <i className="material-icons md-36 ">person</i>
                    <label htmlFor="inputWeight" className="control-label">Height</label>
                    <input className="form-control"
                           id="inputHeight"
                           name={this.props.inputName}
                           onChange={this.onChange}
                           onBlur={this.onBlur}/>
                </div>


                <div className="form-actions">
                    <button type="submit" href="javascript:void(0);" className="btn btn-next"
                            disabled={!this.state.canSubmitForm}>ADD DETAILS
                    </button>
                </div>
            </form>
        }
    });

    ReactDOM.render(<PatientDetails />, document.getElementById("patientDetailsForm"));

    var PatientDetailsBack = React.createClass({
        handleBackButton: function() {
            Bridge.Redirect.redirectToWithLevelsUp("landing/landing.html", 2);
        },
        render: function() {
            return <div>
                <a href="javascript:void(0);" className="btn-back" title="Back" onClick={this.handleBackButton}>
                    <i className="material-icons md-48 md-inactive">keyboard_backspace</i>
                </a>
                <h2 className="page-title">Patient Details</h2>
            </div>
        }
    });

    ReactDOM.render(<PatientDetailsBack />, document.getElementById("back-button-container"));
})();