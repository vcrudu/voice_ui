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
import {
    TopAppBar,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarNavigationIcon,
    TopAppBarActionItem,
    TopAppBarTitle
  } from '@rmwc/top-app-bar';
import { Elevation } from 'rmwc/Elevation';
import { Icon } from 'rmwc/icon';
import { Theme } from '@rmwc/theme';


class LeafHeader extends React.Component{
    constructor(props){
        super(props);
    }

   render(){     
   return (<Elevation z='3'>
   <TopAppBar>
  <TopAppBarRow theme='background'>
    <TopAppBarSection alignStart>
    <Link to={this.props.backUrl}>
      <TopAppBarNavigationIcon theme='primary' icon="arrow_back_ios" />
      </Link>
      <Theme use="textPrimaryOnLight" wrap>
      <TopAppBarTitle>{this.props.title}</TopAppBarTitle>
      </Theme>
    </TopAppBarSection>
  </TopAppBarRow>
</TopAppBar>
           
        </Elevation>);
   }
}

export default LeafHeader;