import React from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions';
import { Link, Redirect } from 'react-router-dom';
import {
    Toolbar,
    ToolbarRow,
    ToolbarSection,
    ToolbarTitle,
    ToolbarMenuIcon,
    ToolbarIcon
} from '@rmwc/Toolbar';


import { Elevation } from '@rmwc/Elevation';


class LeafHeaderComponent extends React.Component{
    constructor(props){
        super(props);
    }

  toggleSound(onOff){
      this.props.actions.toggleSound(onOff);
  }

  render() {
    return (<Elevation z='3'>
      <Toolbar>
        <ToolbarRow>
          <ToolbarSection alignStart theme='background' shrinkToFit='true'>
          <Link to={this.props.backUrl}>
            <ToolbarMenuIcon style={{ marginRight: '20px'}} theme='primary' icon="arrow_back_ios" />
            </Link> 
            <ToolbarTitle theme='textPrimaryOnLight'>{this.props.navigationState.title}</ToolbarTitle>
          </ToolbarSection>
          <ToolbarSection alignEnd theme='background' style={{paddingRight:'5vw'}} >
                                    {
                                        (this.props.voiceState.voiceState=='on')?
                                        (<ToolbarMenuIcon theme='textPrimaryOnLight' onClick={()=>this.toggleSound('off')} icon="volume_mute" />)
                                        :
                                        (<ToolbarMenuIcon theme='textPrimaryOnLight' onClick={()=>this.toggleSound('on')} icon="volume_off" />)
                                    }
            </ToolbarSection>
        </ToolbarRow>
      </Toolbar>
    </Elevation>);
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

const LeafHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeafHeaderComponent);

export default withRouter(LeafHeader);