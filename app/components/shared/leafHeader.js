import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
    Toolbar,
    ToolbarRow,
    ToolbarSection,
    ToolbarTitle,
    ToolbarMenuIcon,
    ToolbarIcon
} from 'rmwc/Toolbar';


import { Elevation } from 'rmwc/Elevation';
import { Icon } from 'rmwc/icon';
import { Theme } from '@rmwc/theme';


class LeafHeader extends React.Component{
    constructor(props){
        super(props);
    }

  render() {
    return (<Elevation z='3'>
      <Toolbar>
        <ToolbarRow>
          <ToolbarSection alignStart theme='background'>
          <Link to={this.props.backUrl}>
            <ToolbarMenuIcon style={{ marginRight: '20px'}} theme='primary' icon="arrow_back_ios" />
            </Link> 
            <ToolbarTitle theme='textPrimaryOnLight'>{this.props.title}</ToolbarTitle>
          </ToolbarSection>
        </ToolbarRow>
      </Toolbar>
    </Elevation>);
  }
}

export default LeafHeader;