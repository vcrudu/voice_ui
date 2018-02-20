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
import {Link} from 'react-router-dom';

class LandingPage extends React.Component {
    handleSignUpClick(e) {
        Bridge.Redirect.redirectToPatientSignUp();
    }
    handleSignIn(e) {
        Bridge.Redirect.redirectToSignIn("");
    }
    render() {
        return <div>
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
        </div>
    }
}

export default LandingPage;