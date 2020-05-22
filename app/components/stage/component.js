import './style.scss';
import React from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions';
import bleService from '../../model/bleService';
import fatSecretService from '../../model/fatSecretService';
import Food from '../food/component';

import {
    Toolbar,
    ToolbarRow,
    ToolbarSection,
    ToolbarTitle,
    ToolbarMenuIcon,
    ToolbarIcon
} from '@rmwc/Toolbar';
import { Typography } from '@rmwc/Typography';
import { Elevation } from '@rmwc/Elevation';
import { Icon } from '@rmwc/Icon';

import TabsPage from '../menu/component';
import logo from '../../assets/images/logo.png';
import LandingPage from '../landing/component';
import './style.scss';
import AudioRenderer from '../audioRenderer/component';
import Home from '../home/component';
import Signs from '../vital-signs/main';
import Devices from '../devices/component';
import Appointments from '../appointments/component';
import ChatList from '../chat/chatList';
import Doctors from '../doctors/component';
import Symptomate from '../symptoms/guestSymptomate';
import Records from '../records/component';
import Shop from '../shop/component';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
  } from '@rmwc/dialog';

  import { Radio } from '@rmwc/radio';
  import { Fab } from '@rmwc/Fab';

import apiService from '../../model/apiService';
import qriskService from '../../model/qriskService';
import chatApiService from '../../model/chatApiService';
import _ from 'underscore';

//!props.loggedIn
class StageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleYes = this.handleYes.bind(this);
        this.handleNo = this.handleNo.bind(this);
        this.onClickLogo = this.onClickLogo.bind(this);
        this.state={logoClickCount:0};
        this.toolbarRef = React.createRef();
        this.viewRef = React.createRef();
        this.clickTitle = this.clickTitle.bind(this);
    }

    componentDidMount(){
        if (this.toolbarRef && this.toolbarRef.current) {
        const node = this.toolbarRef.current;
        const height = node.clientHeight;
        this.props.actions.updateToolbarHeight({toolbarHeight:height});
        }
        if (this.viewRef && this.viewRef.current) {
            const viewNode = this.viewRef.current;
            const viewHeight = viewNode.clientHeight;
            this.props.actions.updateViewHeight({viewHeight:viewHeight});
        }
    }

    toggleSound(onOff){
        this.props.actions.toggleSound(onOff);
    }

    onClickLogo(){
        
        this.setState((prevState)=>{
            let newValue = prevState.logoClickCount+1;
            if(newValue===5){
                setTimeout(this.handleNo, 10000);
            }
            return {logoClickCount:newValue};
        });
    }

    handleYes(){
        apiService.resetPatientState(this.props.userData.token, this.state.cycle, (err)=>{
            this.handleNo();
            chatApiService.getAllCardds(this.props.userData.token, (err, response) => {
                if (response && response.length > 0) {
                    let sortedList = _.sortBy(response,(card)=>0-card.dateTime)
                    this.props.actions.refreshCards(sortedList);
                }
            });
        });
    }

    handleNo(){
        this.setState( {logoClickCount:0});
    }

    clickTitle(){
        //qriskService.getTownScore('TN48JX',this.props.userData.token);
        //bleService.getBP();
        fatSecretService.search('Pasta', this.props.userData.token);
    }

    render() {
        return (!this.props.userData || !this.props.userData.token) ?
            (<LandingPage />) :
            (
                <div ref={this.viewRef}  className='stage'>
                    <div className='toolbar' ref={this.toolbarRef}>
                        <Elevation z='1'>
                            <Toolbar>
                                <ToolbarRow theme='background'>
                                    <ToolbarSection alignStart theme='primary-dark' className='large-toolbar-section'>
                                        <img className="logo" src={logo} style={{ paddingRight: '20vw' }} onClick={this.onClickLogo} />
                                        <ToolbarTitle className="title" theme='textPrimaryOnLight'><Typography use='subheading1'>{this.props.navigationState.title}</Typography></ToolbarTitle>
                                    </ToolbarSection>
                                    <ToolbarSection alignEnd theme='textPrimaryOnLight' style={{ paddingRight: '5vw' }} >
                                        <Icon onClick={() => this.clickTitle()} icon="bluetooth" />
                                    </ToolbarSection>
                                    <ToolbarSection alignEnd theme='textPrimaryOnLight' style={{ paddingRight: '5vw' }} >
                                        {
                                            (this.props.voiceState.voiceState == 'on') ?
                                                (<Icon onClick={() => this.toggleSound('off')} icon="volume_mute" />)
                                                :
                                                (<Icon onClick={() => this.toggleSound('on')} icon="volume_off" />)
                                        }
                                    </ToolbarSection>
                                </ToolbarRow>
                            </Toolbar>
                        </Elevation>
                    </div>
                    <div>
                        {<Route path={this.props.match.url + '/home/:startAssistant'} render={() => <Home startAssistant={true} />} />}
                        {<Route path={this.props.match.url + '/signs'} render={() => <Signs />} />}
                        {<Route path={this.props.match.url + '/devices'} render={() => <Devices />} />}
                        {<Route path={this.props.match.url + '/chatList'} render={() => <ChatList />} />}
                        {<Route path={this.props.match.url + '/appointments'} render={() => <Appointments />} />}
                        {<Route path={this.props.match.url + '/symptoms'} render={() => <Symptomate />} />}
                        {<Route path={this.props.match.url + '/food'} render={() => <Food />} />}
                        {<Route path={this.props.match.url + '/records'} render={() => <Records />} />}
                        {<Route path={this.props.match.url + '/shop'} render={() => <Shop />} />}
                    </div>
                    <Dialog open={this.state.logoClickCount === 5}>
                        <DialogTitle>Reset</DialogTitle>
                        <DialogContent>
                            <Typography use="body1" tag="div" theme="text-secondary-on-background">
                                Do you want to reset the patient state?
                        </Typography>
                            <Radio
                                value="hourly"
                                checked={this.state.cycle === 'hourly'}
                                onChange={evt => this.setState({ cycle: evt.target.value })}>
                                Hourly
                            </Radio>

                            <Radio
                                value="minutely"
                                checked={this.state.cycle === 'minutely'}
                                onChange={evt => this.setState({ cycle: evt.target.value })}>
                                Minutely
                            </Radio>

                        </DialogContent>
                        <DialogActions>
                            <DialogButton onClick={this.handleYes}>Yes</DialogButton>
                            <DialogButton onClick={this.handleNo} isDefaultAction>No</DialogButton>
                        </DialogActions>
                    </Dialog>
                    <TabsPage className="test" />
                </div>
            );
    }
}
const mapStateToPropsHuieva = huieit=>{
    return {
        userData: huieit.userData,
        voiceState: huieit.voiceState,
        navigationState: huieit.navigationState,
        saveMyName:huieit.saveMyName
        
    };
}

const mapDispatchToProps = (dispatch) => {//mapActionsToProps
    return {
      actions: bindActionCreators(Actions, dispatch)
    };
  };

const Stage = connect(
    mapStateToPropsHuieva,
    mapDispatchToProps
)(StageComponent);

export default withRouter(Stage);