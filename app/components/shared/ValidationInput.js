import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';

class ValidationInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validationMessage: "",
            isValid: true
        };
    }

    validateComponent(component) {
        var componentValue = component.target.value;

        var isValid = true;

        for (var i = 0; i < this.props.validators.length; i++) {
            if (this.props.validators[i] == "required") {
                if (componentValue === "") {
                    isValid = false;
                    this.setState({
                        validationMessage: this.props.validatorMessages[i],
                        isValid
                    });
                    break;
                }
            }
            else if (this.props.validators[i] == "compare") {
                if (componentValue != this.props.compareTo) {
                    isValid = false;
                    this.setState({
                        validationMessage: this.props.validatorMessages[i],
                        isValid
                    });
                    break;
                }
            }
            else if (this.props.validators[i] == "pattern") {
                if (!this.props.regex.test(componentValue)) {
                    isValid = false;
                    this.setState({
                        validationMessage: this.props.validatorMessages[i],
                        isValid
                    });
                    break;
                }
            }
        }

        if (isValid) {
            this.setState({
                validationMessage: "",
                isValid
            });
        }
        else {
            this.setState({
                validationMessage: this.props.validatorMessages[i],
                isValid
            });
        }

        this.setState({val:componentValue});

        return isValid;
    }
    onChange(component) {
        this.validateComponent(component);
    }
    onBlur(component) {
        var isValid = this.validateComponent(component);
        this.props.lostFocusCallBack(component, isValid);
    }
    render() {
        return <div>
            <TextField  style={{width:'80vw'}} id={this.props.inputId}
                type={this.props.inputType}
                name={this.props.inputName}
                invalid={!this.state.isValid}
                pattern={this.props.regexString}
                withLeadingIcon={this.props.inputIconName}
                label={this.props.inputLabel}
                onChange={(e)=>{this.onChange(e)}}
                onBlur={(e)=>{this.onBlur(e)}} />

            <TextFieldHelperText validationMsg={!this.state.isValid}>{this.state.validationMessage}</TextFieldHelperText>
        </div>
    }
}

ValidationInput.defaultProps = {
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
}

ValidationInput.propTypes = {
    regexString: PropTypes.string,
    regex: PropTypes.object,
    compareTo: PropTypes.string,
    inputName: PropTypes.string.isRequired,
    inputId: PropTypes.string.isRequired,
    inputType: PropTypes.string.isRequired,
    inputLabel: PropTypes.string.isRequired,
    inputRequired: PropTypes.bool,
    validators: PropTypes.array,
    validatorMessages: PropTypes.array,
    lostFocusCallBack: PropTypes.func
}

export default ValidationInput;