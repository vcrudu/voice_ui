import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import { Fab } from 'rmwc/Fab';
import {
    List,
    SimpleListItem
} from 'rmwc/List';
import dataStorage from '../../model/DataStorage';
import moment from 'moment';

const NoDevices = (<div style={{ marginTop: '20vh', textAlign: 'center', opacity: 0.2 }}>No measurements so far</div>);

class DevicesComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //this.props.actions.changeScreenTitle('Devices');
    }

    componentWillUnmount() {
        if (window.ble) {
            ble.stopScan([], (args) => {
                console.log(args)
            }, (error) => {
                console.log(error)
            });
        }
    }

    onFabClick() {
        if (window.ble) {
            ble.startScan([], (device) => {
                if (device.advertising &&
                    device.advertising.kCBAdvDataServiceUUIDs && device.advertising.kCBAdvDataServiceUUIDs.find((uuid) => uuid === "1810")) {//name==="IH-51-1490-BT"){
                    ble.stopScan(() => {
                        this.props.actions.addDevice(device);
                        console.log(JSON.stringify(device))
                        ble.connect(device.id, (peripheralData) => {
                            console.log(peripheralData)
                            ble.startNotification(device.id, '1810', '2A35', (data) => {
                                const intData = new Uint8Array(data);
                                let measure = { dateTime: Date.now(), systolic: intData[1], diastolic: intData[3] };
                                this.props.actions.addMeasure(measure);
                            }, (error) => {
                                console.log(error)
                            });
                        }, function (error) {
                            console.log(error)
                        });
                    });
                }
            }, (error) => {
                console.log(error)
            });
        }
    }

    render() {
        return (
            <div>

                {/*  <List twoLine>
                        {
                            this.props.devices.map((device)=>{
                                return <SimpleListItem graphic="favorite" text="Blood Pressure" secondaryText="Trichrome Blood pressure monitor" meta="info" />
                            })
                        }
                    </List> */}
                {
                    this.props.devices.length == 0 ? NoDevices :
                        (<List twoLine>
                            {
                                this.props.measures.map((measure) => {
                                    return <SimpleListItem key={measure.dateTime} graphic="favorite" text={`${measure.systolic}/${measure.diastolic}`} secondaryText={moment(measure.dateTime).format("llll")} meta="info" />
                                })
                            }
                        </List>)
                }
                <Fab style={{ position: 'fixed', bottom: '12vh', right: '5vh' }} onClick={() => this.onFabClick()}>add</Fab>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { devices: state.devices, 
        measures: state.measures, 
        dialogState: state.dialogState,
        navigationState: state.navigationState
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const Devices = connect(
    mapStateToProps,
    mapDispatchToProps
)(DevicesComponent)

export default Devices;