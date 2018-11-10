import './style.scss';
import React from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions';

import {
    Toolbar,
    ToolbarRow,
    ToolbarSection,
    ToolbarTitle,
    ToolbarMenuIcon,
    ToolbarIcon
} from 'rmwc/Toolbar';
import { Button, ButtonIcon } from 'rmwc/Button';
import { Typography } from 'rmwc/Typography';
import { Elevation } from 'rmwc/Elevation';
import { Icon } from 'rmwc/Icon';

import TabsPage from '../menu/component';
import logo from '../../assets/images/logo.png';
import LandingPage from '../landing/component';
import './style.scss';
import AudioRenderer from '../audioRenderer/component';
import Home from '../home/component';
import Signs from '../vital-signs/component';
import Devices from '../devices/component';
import Appointments from '../appointments/component';
import ChatList from '../chat/chatList';
import Doctors from '../doctors/component';
import Symptomate from '../symptoms/symptomate';
import Shop from '../shop/component';

//!props.loggedIn
class StageComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    toggleSound(onOff){
        this.props.actions.toggleSound(onOff);
    }

    render() {
        return (!this.props.userData||!this.props.userData.token) ?
            (<LandingPage />) :
            (
                <div className='stage'>
                    <div className='toolbar'>
                        <Elevation z='1'>
                            <Toolbar>
                                <ToolbarRow theme='background'>
                                    <ToolbarSection alignStart theme='primary-dark' className='large-toolbar-section'>
                                        <img className="logo" src={logo} style={{paddingRight:'20vw'}} />
                                        <ToolbarTitle className="title" theme='textPrimaryOnLight'><Typography use='subheading1'>{this.props.navigationState.title}</Typography></ToolbarTitle>
                                    </ToolbarSection>
                                    <ToolbarSection alignEnd theme='textPrimaryOnLight' style={{paddingRight:'5vw'}} >
                                    {
                                        (this.props.voiceState.voiceState=='on')?
                                        (<Icon onClick={()=>this.toggleSound('off')} icon="volume_mute" />)
                                        :
                                        (<Icon onClick={()=>this.toggleSound('on')} icon="volume_off" />)
                                    }
                                    </ToolbarSection>
                                </ToolbarRow>
                            </Toolbar>
                        </Elevation>
                    </div>
                    <div>
                        {<Route path={this.props.match.url + '/home/:startAssistant'} render={() => <Home startAssistant={true}     />} />}
                        {<Route path={this.props.match.url + '/signs'} render={() => <Signs />} />}
                        {<Route path={this.props.match.url + '/devices'} render={() => <Devices />} />}
                        {<Route path={this.props.match.url + '/chatList'} render={() => <ChatList />} />}
                        {<Route path={this.props.match.url + '/doctors'} render={() => <Doctors />} />}
                        {<Route path={this.props.match.url + '/symptoms'} render={() => <Symptomate />} />}
                        {<Route path={this.props.match.url + '/shop'} render={() => <Shop />} />}
                    </div>
                    <TabsPage className="test" />
                </div>
            );
    }
}
const mapStateToProps = state=>{
    return {
        userData: state.userData,
        voiceState: state.voiceState,
        navigationState: state.navigationState
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(Actions, dispatch)
    };
  };

const Stage = connect(
    mapStateToProps,
    mapDispatchToProps
)(StageComponent);

export default withRouter(Stage);