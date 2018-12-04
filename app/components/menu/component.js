import '@material/tab-bar/dist/mdc.tab-bar.css';
import '@material/tab/dist/mdc.tab.css';
import '@material/tab-scroller/dist/mdc.tab-scroller.css';
import '@material/tab-indicator/dist/mdc.tab-indicator.css';
import './style.scss';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions';

import { TabBar, Tab} from 'rmwc/Tabs';
import { Typography } from 'rmwc/Typography';
import { Theme } from 'rmwc/Theme';
import { Link, Redirect } from 'react-router-dom';

class TabsPageComponent extends Component {
    constructor(props) {
        super(props);
    }

    onChange(event) {
        if(event.detail.index===5){
            this.props.actions.signInOut(null);
            if(window.socket)
            window.socket.disconnect(); 
        }

        if(event.detail.index===4){
            if(window.cordova && window.cordova.InAppBrowser){
                window.cordova.InAppBrowser.open("https://app.trichromehealth.com/#/patient/patient.devices/patient.devices.buy?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InZjcnVkdUBob3RtYWlsLmNvbSIsImlhdCI6MTUyMDU1MTI5OX0.CepkyHlhAqGTi9JdYzfFbH64ztmvZS9xq5xjQRLwEuU", "_blank", 'location=no');
            }
        }
    }

    render() {
        return (<div className="menu">
                <TabBar onActivate={(event) => { this.onChange(event) }}>
                <Link style={{textDecoration:'none currentcolor solid'}} to='/stage/home/false'><Tab stacked restrictIndicator icon='home' label='Home'></Tab></Link>
                <Link style={{textDecoration:'none currentcolor solid'}} to='/stage/signs'><Tab stacked restrictIndicator icon='timeline' label='Data'></Tab></Link>
                    {/* <Tab theme='primary-dark'><Link to='/stage/devices'><TabIcon theme='primary-dark'>devices_other</TabIcon><TabIconText>Devices</TabIconText></Link></Tab> */}
                <Link style={{textDecoration:'none currentcolor solid'}} to='/stage/chatList'><Tab stacked restrictIndicator icon='list'>History</Tab></Link>
                <Link style={{textDecoration:'none currentcolor solid'}} to='/stage/symptoms'>   <Tab stacked restrictIndicator icon='playlist_add_check'>Symptoms</Tab></Link>
                 <Tab stacked restrictIndicator icon='add_shopping_cart'>Shop</Tab>
                    <Tab stacked restrictIndicator icon='exit_to_app'>Sign Out</Tab>
                </TabBar>
        </div>);
    }
}

const mapStateToProps = state => {
    return { devices: state.devices, measures: state.measures, dialogState: state.dialogState };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const TabsPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(TabsPageComponent)

export default TabsPage;