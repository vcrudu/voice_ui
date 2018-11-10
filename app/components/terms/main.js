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
import { Typography } from 'rmwc/Typography';
import { Checkbox } from '@rmwc/checkbox';
import { Button } from '@rmwc/button';
import { ThemeProvider } from '@rmwc/theme';
import { Snackbar } from '@rmwc/snackbar';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions';
import {Link, withRouter} from 'react-router-dom'

class MainTermsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {contentRead:false, agreedTerms: false, snackbarIsOpen: true};
        this.contentDiv = React.createRef();
    }
    render() {
        return (
            <div>
                <div style={{ width: '100%' }}>
                    <Elevation z='2'>
                        <Toolbar>
                            <ToolbarRow theme='background'>
                                <ToolbarSection theme='primary-dark' className='large-toolbar-section'>
                                    <ToolbarTitle className="title" theme='textPrimaryOnLight'><Typography use='subheading1'>Terms and Conditions</Typography></ToolbarTitle>
                                </ToolbarSection>
                            </ToolbarRow>
                        </Toolbar>
                    </Elevation>
                </div>
                <div>
                <Elevation z='1'>
                    <div ref={this.contentDiv} style={{ margin: '1rem', overflow: 'scroll', height: '70vh' }} onScroll={()=>{
                        if(this.contentDiv.current.scrollTop>2900){
                            this.setState({contentRead:true});
                        }
                    }}>
                        <Typography use="headline5">
                            <h1 style={{ textAlign: 'center' }}>Privacy Policy</h1>
                        </Typography>
                        <Typography use="body2">
                            <p style={{ textIndent: '30px' }}>Effective date: November 03, 2018</p>


                            <p>Trichrome Health Assistant ("us", "we", or "our") operates the Trichrome Health Assistant mobile application (the "Service").</p>

                            <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>

                            <p>We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions.</p>
                        </Typography>
                        <Typography use="headline6">
                            <h2 style={{ textAlign: 'center' }}>Information Collection And Use</h2>
                        </Typography>
                        <Typography use="body2">
                            <p style={{ textAlign: 'center' }}>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

                        </Typography>
                        <br/>
                        <Typography use="subtitle1">
                            <h3 style={{ textAlign: 'center' }}>Types of Data Collected</h3>
                        </Typography>
                        <Typography use="subtitle2">
                            <h4>Personal Data</h4>
                        </Typography>
                        <Typography use="body2">
                            <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>

                            <ul>
                                <li>Email address</li><li>First name and last name</li><li>Phone number</li><li>Cookies and Usage Data</li>
                            </ul>
                        </Typography>
                        <Typography use="subtitle2">
                            <h4>Usage Data</h4>
                        </Typography>
                        <Typography use="body2">
                            <p>When you access the Service by or through a mobile device, we may collect certain information automatically, including, but not limited to, the type of mobile device you use, your mobile device unique ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browser you use, unique device identifiers and other diagnostic data ("Usage Data").</p>
                        </Typography>
                        <Typography use="subtitle2">
                            <h4>Tracking & Cookies Data</h4>
                        </Typography>
                        <Typography use="body2">
                            <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.</p>
                            <p>Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.</p>
                            <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
                            <p>Examples of Cookies we use:</p>
                            <ul>
                                <li><strong>Session Cookies.</strong> We use Session Cookies to operate our Service.</li>
                                <li><strong>Preference Cookies.</strong> We use Preference Cookies to remember your preferences and various settings.</li>
                                <li><strong>Security Cookies.</strong> We use Security Cookies for security purposes.</li>
                            </ul>
                        </Typography>
                        <Typography use="headline6">
                            <h2 style={{ textAlign: 'center' }}>Use of Data</h2>
                        </Typography>
                        <Typography use="body2">
                            <p>Trichrome Health Assistant uses the collected data for various purposes:</p>
                            <ul>
                                <li>To provide and maintain the Service</li>
                                <li>To notify you about changes to our Service</li>
                                <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                                <li>To provide customer care and support</li>
                                <li>To provide analysis or valuable information so that we can improve the Service</li>
                                <li>To monitor the usage of the Service</li>
                                <li>To detect, prevent and address technical issues</li>
                            </ul>
                        </Typography>
                        <Typography use="headline6">
                            <h2 style={{ textAlign: 'center' }}>Transfer Of Data</h2>
                        </Typography>
                        <Typography use="body2">
                            <p>Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.</p>
                            <p>If you are located outside United Kingdom and choose to provide information to us, please note that we transfer the data, including Personal Data, to United Kingdom and process it there.</p>
                            <p>Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>
                            <p>Trichrome Health Assistant will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.</p>
                        </Typography>
                        <Typography use="headline6">
                            <h2 style={{ textAlign: 'center' }}>Disclosure Of Data</h2>
                        </Typography>
                        <Typography use="subtitle1">
                            <h3>Legal Requirements</h3>
                        </Typography>
                        <Typography use="body2">
                            <p>Trichrome Health Assistant may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
                            <ul>
                                <li>To comply with a legal obligation</li>
                                <li>To protect and defend the rights or property of Trichrome Health Assistant</li>
                                <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
                                <li>To protect the personal safety of users of the Service or the public</li>
                                <li>To protect against legal liability</li>
                            </ul>
                        </Typography>
                        <Typography use="headline6">
                            <h2 style={{ textAlign: 'center' }}>Security Of Data</h2>
                        </Typography>
                        <Typography use="body2">
                            <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
                        </Typography>
                        <Typography use="headline6">
                            <h2 style={{ textAlign: 'center' }}>Service Providers</h2>
                        </Typography>
                        <Typography use="body2">
                            <p>We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.</p>
                            <p>These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
                        </Typography>

                        <Typography use="headline6">
                            <h2 style={{ textAlign: 'center' }}>Links To Other Sites</h2>
                        </Typography>
                        <Typography use="body2">
                            <p>Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.</p>
                            <p>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>
                        </Typography>
                        <Typography use="headline6">
                            <h2 style={{ textAlign: 'center' }}>Children's Privacy</h2>
                        </Typography>
                        <Typography use="body2">
                            <p>Our Service does not address anyone under the age of 18 ("Children").</p>
                            <p>We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>
                        </Typography>
                        <Typography use="headline6">
                            <h2 style={{ textAlign: 'center' }}>Changes To This Privacy Policy</h2>
                        </Typography>
                        <Typography use="body2">
                            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                            <p>We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.</p>
                            <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
                        </Typography>

                        <Typography use="headline6">
                            <h2 style={{ textAlign: 'center' }}>Contact Us</h2>
                        </Typography>
                        <Typography use="body2">
                            <p>If you have any questions about this Privacy Policy, please contact us:</p>
                            <ul>
                                <li>By email: info@trichromehealth.com</li>

                            </ul>
                        </Typography>
                    </div>
                </Elevation>
                    <div style={{ paddingLeft: '3vw', paddingRight: '3vw' }}>
                        <Checkbox disabled={!this.state.contentRead}
                            onChange={evt => this.setState({ agreedTerms: evt.target.checked })}>
                            I accept the Terms and Conditions in the Privacy Policy
                        </Checkbox>
                    </div>
                    <div style={{ paddingLeft: '3vw', paddingRight: '3vw' }}>
                        <ThemeProvider options={{
                             primary: 'red',
                             secondary: 'blue'
                        }}>
                        
                        <Link to='/stage/home/false'><Button style={{ width: '100%' }} onClick={()=>{
                            this.props.actions.updateSettingsData('termsAndConditionsAgreed', true);
                        }} disabled={!this.state.contentRead || !this.state.agreedTerms } accent>Continue</Button></Link>
                        
                        </ThemeProvider>
                    </div>
                </div>
                <Snackbar
                    show={this.state.snackbarIsOpen}
                    onHide={evt => this.setState({ snackbarIsOpen: false })}
                    message="Scroll to read all text"
                    timeout={10000}
                    dismissesOnAction={true}
                />
            </div>
        );
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

const MainTerms = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainTermsComponent);

export default withRouter(MainTerms);