import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import apiService from '../../model/apiService';
import { LinearProgress } from '@rmwc/linear-progress';
import {Link, withRouter } from 'react-router-dom';
import RequestNameScroller from './requestNameScroller';
import { Fab } from '@rmwc/Fab';
import moment from 'moment';
import {
    List,
    ListDivider,
    SimpleListItem
  } from '@rmwc/list';

class RecordsComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            synching: true,
            requestName: 'summary'
        }
        this.onHideSelectRequest = this.onHideSelectRequest.bind(this);
    }

    componentDidMount(){
        this.props.actions.changeScreenTitle('Summary');
        apiService.getPatientData(this.props.userData.token, this.state.requestName, (error, result) => {
            this.setState({
                details: result,
                synching: false
            });
        });
    }

    onHideSelectRequest(requestChangeResult, requestName){
        this.setState({showSelectRequest:false});
        if(requestChangeResult==='Set'){
            this.setState({
                synching: true,
                requestName: requestName
            });
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.requestName!==this.state.requestName)
        apiService.getPatientData(this.props.userData.token, this.state.requestName, (error, result) => {
            this.setState({
                details: result,
                synching: false
            });
        });
    }

    updateCurrentRecordDetails(details){
        debugger;
        this.props.actions.updateCurrentRecordDetails(details);
    }

    render() {

        return (
            <div>
                {
                    this.state.synching ?
                        (<LinearProgress determinate={false} />) : null
                }
                {
                    !this.state.synching ?
                        (<Fab style={{ position: 'fixed', zIndex:'10', bottom: '15vh', right: '5vh' }} icon='arrow_drop_down_circle'
                            onClick={() => {
                                this.setState({ showSelectRequest: true });
                            }}
                        ></Fab>) : null
                }
                {
                    this.state.details ? (
                        <div>
                            <List style={{ height: '75vh', overflowY: 'scroll' }} twoLine>
                                {this.state.details ?
                                    this.state.details["q1:event"].map((item) => {
                                        return (
                                            <div key={item["q1:id"]}>
                                                <Link onClick={()=>this.updateCurrentRecordDetails(item)} to={`/records/details/${this.state.requestName}`}>
                                                <SimpleListItem graphic="info" text={item["q1:displayTerm"]} secondaryText={moment(item["q1:effectiveTime"].value).format('L')} />
                                                </Link>
                                                <ListDivider />
                                            </div>);
                                    }) : null
                                }
                            </List>
                        </div>
                    ) : null
                }
                <RequestNameScroller show={this.state.showSelectRequest} onChangeShowState={this.onHideSelectRequest}/>
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
        currentRecordDetails: state.currentRecordDetails
    };
}

const Records = connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordsComponent);

export default withRouter(Records);