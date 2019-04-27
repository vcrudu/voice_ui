import React, { Component } from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions';
import PropTypes from 'prop-types';
import VitalSignsFactory from '../../model/VitalSignsFactory';
import apiService from '../../model/apiService';
import moment from 'moment';
import _ from 'underscore';
import * as d3 from "d3";
import bleService from '../../model/bleService';
import './styles/charts.scss'
import '@material/card/dist/mdc.card.css';
import '@material/button/dist/mdc.button.css';
import '@material/icon-button/dist/mdc.icon-button.css';
import '@material/theme/dist/mdc.theme.css';

import {
    Card,
    CardPrimaryAction,
    CardMedia,
    CardAction,
    CardActions,
    CardActionButtons,
    CardActionIcons
} from '@rmwc/Card';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
  } from '@rmwc/dialog';

import { Fab } from '@rmwc/Fab';
import { ThemeProvider } from '@rmwc/theme';

import { Typography } from '@rmwc/Typography';
import Average from './average';
import LeafHeader from '../shared/leafHeader';

class SymptomsHistoryComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onFabClick = this.onFabClick.bind(this);
        this.onSymptomClick = this.onSymptomClick.bind(this);
    }

    onFabClick() {
    }

    componentDidMount() {
        apiService.getSymptomsHystory(this.props.userData.token,(err,response)=>{
            this.setState({symptoms:response.result});
        });
        this.props.actions.changeScreenTitle('Symptoms history');
    }

    onSymptomClick(){

    }

//amber '#ffa000'
    render() {
        return this.state.symptoms ?
            (<div>
                <LeafHeader backUrl='/stage/signs' title='Symptoms history' />
                {
                    this.state.symptoms.map((symptom) => {
                        return (
                                <ThemeProvider options={{
                                    primary: 'red',
                                    secondary: 'white'
                                }}>
                                    <Card theme='primaryBg' style={{ width: '21rem', marginTop: '5px', marginLeft: 'auto', marginRight: 'auto' }}>
                                        <CardPrimaryAction onClick={() => this.onSymptomClick()}>
                                            <div style={{ padding: '0rem 0rem 0rem 1rem' }}>
                                                <Typography use="headline6" style={{ display: 'inline-block', fontWeight: 'bold', width: '44vw' }} theme="secondary">{symptom.name}</Typography>
                                                <div>
                                                        <Typography use="caption" style={{ textAlign: 'end' }} theme="secondary">{symptom.description}</Typography>
                                                </div>
                                                <div></div>
                                                <Typography use="caption" style={{ position: 'relative', left: '2vh', marginLeft: '56vw' }} theme="secondary">{moment(symptom.time).format('ll')}</Typography>
                                            </div>
                                        </CardPrimaryAction>
                                    </Card>
                                </ThemeProvider>
                        )
                    })
                }
            </div>) : null
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const mapStateToProps = state=>{
    return {
        userData:state.userData,
        navigationState: state.navigationState,
        currentChatCommand: state.currentChatCommand
    };
}

const SymptomsHistory = connect(
    mapStateToProps,
    mapDispatchToProps
)(SymptomsHistoryComponent);

export default withRouter(SymptomsHistory);