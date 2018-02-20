import './style.scss';
import  React, { Component } from 'react';
import { TabBar, Tab, TabIcon, TabIconText, TabBarScroller } from 'rmwc/Tabs';
import { Typography } from 'rmwc/Typography';
import { Theme } from 'rmwc/Theme';
import {Link, Redirect} from 'react-router-dom';

class TabsPage extends Component {
    constructor(props){
        super(props);
        this.state={};
    }

    onChange(event){
        this.setState({activeTabIndex: event.target.value});
    }

    render() {
        return (this.state.activeTabIndex===6)?(<Redirect to='/'/>):(<div className="menu">
            <TabBarScroller>
                <TabBar onChange={(event)=>{this.onChange(event)}}>
                        <Tab theme='primary-dark'><TabIcon theme='primary-dark'>home</TabIcon><TabIconText>Home</TabIconText></Tab>
                        <Tab theme='primary-dark'><TabIcon id="speech-control" theme='primary-dark'>timeline</TabIcon><TabIconText>Signs</TabIconText></Tab>
                        <Tab theme='primary-dark'><TabIcon theme='primary-dark'>devices_other</TabIcon><TabIconText>Device</TabIconText></Tab>
                        <Tab theme='primary-dark'><TabIcon theme='primary-dark'>event</TabIcon><TabIconText>Appointments</TabIconText></Tab>
                        <Tab theme='primary-dark'><TabIcon theme='primary-dark'>playlist_add_check</TabIcon><TabIconText>Symptoms</TabIconText></Tab>
                        <Tab theme='primary-dark'><TabIcon theme='primary-dark'>add_shopping_cart</TabIcon><TabIconText>Shop</TabIconText></Tab>
                        <Tab theme='primary-dark'><TabIcon theme='primary-dark'>exit_to_app</TabIcon><TabIconText>Sign Out</TabIconText></Tab>
                    </TabBar>   
            </TabBarScroller>
        </div>);
    }
}

export default TabsPage;