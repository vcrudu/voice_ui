import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import moment from 'moment';
import _ from 'underscore';
import LeafHeader from '../shared/leafHeader';
import '@rmwc/circular-progress/circular-progress.css';
import { LinearProgress } from '@rmwc/linear-progress';
import {patientRequestDescriptions} from '../../constants/patientRequestDescriptions';

class RecordDetailsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {synching:false};
    }

    componentDidMount() {
        
    }

    render() {
        if(!this.state) return null;
            return (
                <div>
                    <LeafHeader backUrl='/stage/records' title={patientRequestDescriptions[this.props.match.params.requestName]} />
                    <div>
                        {this.props.currentRecordDetails["q1:displayTerm"]}<br/>
                        {this.props.currentRecordDetails["q1:medication"]?
                        this.props.currentRecordDetails["q1:medication"]["q1:dosage"]:""}<br/>
                        {this.props.currentRecordDetails["q1:medication"]?
                        this.props.currentRecordDetails["q1:medication"]["q1:quantityRepresentation"]:""}<br/>
                    </div>
                </div>
            );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const mapStateToProps = state => {
    return {
        userData: state.userData,
        currentRecordDetails:state.currentRecordDetails
    };
}

const RecordDetails = connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordDetailsComponent);

export default withRouter(RecordDetails);