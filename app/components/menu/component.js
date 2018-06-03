import './style.scss';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions';

import { TabBar, Tab, TabIcon, TabIconText, TabBarScroller } from 'rmwc/Tabs';
import { Typography } from 'rmwc/Typography';
import { Theme } from 'rmwc/Theme';
import { Link, Redirect } from 'react-router-dom';

class TabsPageComponent extends Component {
    constructor(props) {
        super(props);
    }

    onChange(event) {
        if(event.target.value===4){
            this.props.actions.signInOut(null);
        }
    }

    render() {
        return (<div className="menu">
            <TabBarScroller>
                <TabBar onChange={(event) => { this.onChange(event) }}>
                    <Tab theme='primary-dark'><Link to='/stage/home/false'><TabIcon theme='primary-dark'>home</TabIcon><TabIconText>Home</TabIconText></Link></Tab>
                    <Tab theme='primary-dark'><Link to='/stage/signs'><TabIcon theme='primary-dark'>timeline</TabIcon><TabIconText>Signs</TabIconText></Link></Tab>
                    {/* <Tab theme='primary-dark'><Link to='/stage/devices'><TabIcon theme='primary-dark'>devices_other</TabIcon><TabIconText>Devices</TabIconText></Link></Tab> */}
                    <Tab theme='primary-dark'><Link to='/stage/appointments'><TabIcon theme='primary-dark'>event</TabIcon><TabIconText>Appointments</TabIconText></Link></Tab>
                    <Tab theme='primary-dark'><Link to='/stage/symptoms'><TabIcon theme='primary-dark'>playlist_add_check</TabIcon><TabIconText>Symptoms</TabIconText></Link></Tab>
                    {/* <Tab theme='primary-dark'><Link to='/stage/shop'><TabIcon theme='primary-dark'>add_shopping_cart</TabIcon><TabIconText>Shop</TabIconText></Link></Tab> */}
                    <Tab theme='primary-dark'><TabIcon theme='primary-dark'>exit_to_app</TabIcon><TabIconText>Sign Out</TabIconText></Tab>
                </TabBar>
            </TabBarScroller>
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