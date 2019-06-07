import React from 'react';
import Picker from 'react-mobile-picker-scroll';
import { Button } from '@rmwc/Button';
import './style.scss'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import {patientRequestNames} from '../../constants/patientRequestNames';
            
class RequestNameScrollerComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            optionGroups: { 
                requestName: ["Summary","Problems","Diagnosis","Medications",
                "Risks & Warnings","Procedures","Investigations","Examinations",
                "Events","Patient details"]
            },
            requestValue:patientRequestNames,
            valueGroups: {requestName: 'Summary'},
        };
        this.onChange = this.onChange.bind(this);
        this.onChangeShowState = this.onChangeShowState.bind(this);
    }

    onChange(name, value){
        this.setState(({valueGroups}) => ({
            valueGroups: {
              ...valueGroups,
              [name]: value
            },
            pristine: false
          }));
    }

    onChangeShowState(result){
        if(!this.state.pristine && result==="Set"){
            this.props.actions.changeScreenTitle(this.state.valueGroups.requestName);
            this.props.onChangeShowState("Set", this.state.requestValue[this.state.valueGroups.requestName])
        }
        else this.props.onChangeShowState("Cancel");
    }

    componentDidUpdate(prevProps){
        if(prevProps.show!=this.props.show && this.props.show){
            this.setState({pristine:true});
        }
    }
    
    render() {
        if (this.props.show) {
            return (<div style={{ width: '100vw', position: 'fixed', bottom: '0', zIndex: '100', backgroundColor:'white' }}>
                <Button label="Cancel" onClick={()=>this.onChangeShowState("Cancel" )} />
                <Button style={{float:'right'}} label="Set" onClick={()=>this.onChangeShowState("Set")} />
                <div>
                <Picker
                    style={{ width: '100vw', height:'180', backgroundColor: 'white' }}
                    optionGroups={this.state.optionGroups}
                    valueGroups={this.state.valueGroups}
                    onChange={this.onChange} />
                </div>
            </div>);
        } else return null;
    }    
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const mapStateToProps = state => {
    return {
        userData: state.userData
    };
}

const RequestNameScroller = connect(
    mapStateToProps,
    mapDispatchToProps
)(RequestNameScrollerComponent);

export default withRouter(RequestNameScroller);