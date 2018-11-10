import React from 'react';
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
import LandingCarousel from './landingCarousel';
import MainTerms from '../terms/main';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions';


class LandingPageComponent extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (<div>
            <LandingCarousel/>
            <Toolbar style={{position: 'fixed',bottom: 0,right: 0,width: '100%'}}>
                    <ToolbarRow theme='background'>
                        <ToolbarSection alignStart theme='primary-dark'>
                            <Link to='/signup'>
                                <Button style={{marginLeft:'30px'}}>Sign Up</Button>
                            </Link>
                        </ToolbarSection>
                        <ToolbarSection alignEnd theme='primary-dark'>
                            <Link to='/signin'>
                            <Button style={{marginRight:'30px'}}>Sign In</Button>
                            </Link>
                        </ToolbarSection>
                    </ToolbarRow>
            </Toolbar>
        </div>);
    }
}

const mapStateToProps = state=>{
    return {
        settingsData: state.settingsData
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(Actions, dispatch)
    };
  };

const LandingPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(LandingPageComponent);

export default withRouter(LandingPage);