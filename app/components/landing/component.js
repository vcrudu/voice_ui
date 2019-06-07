import React from 'react';
import {
    Toolbar,
    ToolbarRow,
    ToolbarSection,
    ToolbarTitle,
    ToolbarMenuIcon,
    ToolbarIcon
} from '@rmwc/Toolbar';
import { Button } from '@rmwc/Button';
import { Fab } from '@rmwc/Fab';
import { Typography } from '@rmwc/Typography';
import LandingCarousel from './landingCarousel';
import MainTerms from '../terms/main';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';


class LandingPageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onFabClick() {
        this.setState({ signUp: 'go' });
    }

    render() {
        if (this.state.signUp) {
            return <Redirect
                to={'/signup'} />
        }
        if (this.state.checkSymptoms) {
            return <Redirect
                to={`/chat/home/symptoms/${new Date().getMilliseconds()}/Check your symptoms`} />
        } else {
            return (<div>
                <LandingCarousel />
                <Toolbar style={{ position: 'fixed', bottom: 0, right: 0, width: '100%' }}>
                    <ToolbarRow theme='background'>
                      <ToolbarSection alignStart theme='primary-dark'>
                            <Link to='/guest_symptoms'>
                                <Button style={{marginLeft:'30px'}}>Your symptoms</Button>
                            </Link>
                        </ToolbarSection>
                        {/*  <ToolbarSection alignStart theme='primary-dark'>
                            <Link to='/signup'>
                                <Button style={{marginLeft:'30px'}}>Sign Up</Button>
                            </Link>
                        </ToolbarSection> */}
                        <ToolbarSection alignEnd theme='primary-dark'>
                            <Link to='/signin'>
                                <Button style={{ marginRight: '30px' }}>Sign In</Button>
                            </Link>
                        </ToolbarSection>
                    </ToolbarRow>
                </Toolbar>
                <Fab style={{ position: 'fixed', bottom: '15vh', right: '5vh' }} icon='person_add'
                        onClick={() => {
                            this.onFabClick();
                        }}
                    ></Fab>
            </div>);
        }
    }
}

const mapStateToProps = state => {
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