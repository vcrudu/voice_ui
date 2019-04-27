import React from 'react';
import imgMonitor from './images/img-monitor.png';
import imgConnectSpecialist from './images/img-connect-specialist.png';
import imgGetAlerts from './images/img-get-alerts.png';
import LoggedOutHeader from '../shared/loggedOutHeader';
import ReactSwipe from 'react-swipe';


class LandingCarousel extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
       
    }

    render() {
        return (<div>
            <LoggedOutHeader />

        <ReactSwipe swipeOptions={{speed: 400,auto: 12000, continuous: true}}>
                <div style={{backgroundColor:'green', color:'white', height:'100vh'}}>
                    <div className="carousel-caption">
                    <div style={{display: 'flex',justifyContent: 'center'}}>
                    <img style={{width:'288px', height:'131px'}} src={imgMonitor}/>
                    </div>
                    </div>
                    <div>
                        <h2 style={{display: 'flex',justifyContent: 'center', textAlign:'center'}}>Monitor Your Blood Pressure</h2>
                        <div style={{display: 'flex',justifyContent: 'center', textAlign:'center'}}>
                            <br />
                            {"CLICK – BUY, CLICK MEASURE"} <br />
                            {"If you have a long term or acute condition wirelessly measure your pulse, heart rate, blood pressure, temperature and respiration."}<br />
                            {"Buy clinically approved devices at the lowest price in the market."}<br />
                            {"Make available to carer, doctor nurse and yourself to review the whole history."}<br />
                            {"All totally free."}
                        </div>
                    </div>
                </div>
                <div style={{backgroundColor:'#ffa000', color:'white', height:'100vh'}}>
                    <div className="carousel-caption">
                    <div style={{display: 'flex',justifyContent: 'center'}}>
                    <img style={{width:'288px', height:'131px'}} src={imgGetAlerts}/>
                    </div>
                    </div>
                    <div>
                        <h2 style={{display: 'flex',justifyContent: 'center', textAlign:'center'}}>Get Alerts</h2>
                        <br />
                        <div style={{display: 'flex',justifyContent: 'center', textAlign:'center'}}>
                            {"Our intelligent cloud platform looks at the all readings, analyze them and using algorithms provides actionable alerts direct to your app"} <br />
                            {"GREEN, AMBER, RED."}<br />
                            {"The trichrome difference."}
                    </div>
                    </div>
                </div>

                <div style={{backgroundColor:'red', color:'white', height:'100vh'}}>
                    <div className="carousel-caption">
                    <div style={{display: 'flex',justifyContent: 'center'}}>
                    <img style={{width:'288px', height:'131px'}} src={imgConnectSpecialist}/>
                    </div>
                    </div>
                    <div>
                        <h2 style={{display: 'flex',justifyContent: 'center', textAlign:'center'}}>Connect</h2>
                        <div style={{display: 'flex',justifyContent: 'center', textAlign:'center'}}>
                            {"If you get alerts you can just book an appointment with a qualified nurse."}<br />
                            {"If you wish your GP, district nurse, family, carer to assess and triage your call for immediate action and peace of mind"}<br />
                            {"Live availabilities are provided automatically."}<br />
                            {"They will call back and notify you just before the call."}<br />
                            {"It gives you HD quality video, chat, audio and much more beside."}
                    </div>
                    </div>
                </div>
                
        </ReactSwipe>
                <ol className="carousel-indicators">
                    <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
                    <li data-target="#myCarousel" data-slide-to="1"></li>
                    <li data-target="#myCarousel" data-slide-to="2"></li>
                </ol>
            </div>);
   
    }
}

export default LandingCarousel;