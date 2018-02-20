import './style.scss';
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
import { Elevation } from 'rmwc/Elevation';
import TabsPage from '../menu/component';
import logo from '../../assets/images/logo.png';
import LandingPage from '../landing/component';
import './style.scss';
import AudioRenderer from '../audioRenderer/component';

const Stage = (props) => {
    return !props.loggedIn ?
        (<LandingPage />) :
        (
            <div className='stage'>
                <div className='toolbar'>
                    <Elevation z='1'>
                        <Toolbar>
                            <ToolbarRow theme='background'>
                                <ToolbarSection alignStart theme='primary-dark' className='large-toolbar-section'>
                                    <img className="logo" src={logo} />
                                    <ToolbarTitle className="title"><Typography use='subheading1'>{props.title}</Typography></ToolbarTitle>
                                </ToolbarSection>
                            </ToolbarRow>
                        </Toolbar>
                    </Elevation>
                </div>
                <div>
                    {props.children}
                    <AudioRenderer/>
                </div>
                <TabsPage className="test" />
            </div>
        );
}

export default Stage;