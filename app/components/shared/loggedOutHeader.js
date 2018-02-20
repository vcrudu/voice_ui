import React from 'react';
import {
    Toolbar,
    ToolbarRow,
    ToolbarSection,
    ToolbarTitle,
    ToolbarMenuIcon,
    ToolbarIcon
} from 'rmwc/Toolbar';
import { Elevation } from 'rmwc/Elevation';
import trichromeHealthcareImg from './images/trichrome-healthcare.png';
import logo from './images/logo.png';

const LoggedOutHeader = ()=>{
   return (<Elevation z='1'>
            <Toolbar>
                <ToolbarRow theme='background'>
                    <ToolbarSection alignStart theme='primary-dark'>
                        <img src={trichromeHealthcareImg} style={{height:'15px', marginLeft:'10px'}}/>
                    </ToolbarSection>
                    <ToolbarSection alignEnd theme='primary-dark'>
                        <img className="logo" src={logo} style={{marginRight:'5px'}} />
                    </ToolbarSection>
                </ToolbarRow>
            </Toolbar>
        </Elevation>);
}

export default LoggedOutHeader;