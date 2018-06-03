import React from 'react';
import {
    Card,
    CardMedia,
    CardAction,
    CardActions,
    CardActionButtons,
    CardActionIcons
  } from 'rmwc/Card';

import { Typography } from 'rmwc/Typography';


class PairedDevice extends React.Component {
    constructor() {
        this.state = {
            deviceIcon: ""
        }
    }

    componentDidMount() {
        switch (this.props.modelType) {
            case "Temperature":
                this.setState({ deviceIcon: "images/thermometer-icon.png" });
                break;
            case "BloodOxygen":
                this.setState({ deviceIcon: "images/oximeter-JPD-500F-icon.png" });
                break;
            case "BloodPressure":
                if (this.props.model === "UA-767PBT-Ci") {
                    this.setState({ deviceIcon: "images/blood-pressure-UA-767BT-Ci-monitor-icon.png" });
                }
                else {
                    this.setState({ deviceIcon: "images/UA-651BLE-350x240.png" });
                }
                break;
            case "Weight":
                this.setState({ deviceIcon: "images/UC-355PBT-Ci.png" });
                break;
        }
    }

    handleDeviceItemClick(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        switch (this.props.modelType) {
            case "Temperature":
                Bridge.Redirect.redirectTo("Thermometer-measure.html");
                break;
            case "BloodOxygen":
                Bridge.Redirect.redirectTo("BloodOxygen-measure.html");
                break;
            case "BloodPressure":
                if (this.props.model === "UA-767PBT-Ci") {
                    Bridge.Redirect.redirectTo("UC-355PBT-Ci-measure.html");
                }
                else {
                    Bridge.Redirect.redirectTo("BloodPressure-measure.html");
                }
                break;
        }
    }

    render() {
        return <div>
            <div className="list-group-item" onClick={this.handleDeviceItemClick}>
                <div className="row">
                    <div className="col-xs-7">
                        <h4 className="primary-text">{this.props.model}</h4>
                        <p className="primary-text-secondary">{this.props.description}</p>
                    </div>
                    <div className="col-xs-5">
                        <img src={this.state.deviceIcon} className="img-responsive device-image" />
                    </div>
                </div>
            </div>
            <div className="list-group-separator full-width"></div>
        </div>
    }
}

class Device extends React.Component {
    constructor() {
        this.state = {
            deviceIcon: "",
        }
    }
    componentDidMount() {
        switch (this.props.modelType) {
            case "Temperature":
                this.setState({ deviceIcon: "images/thermometer-icon.png" });
                break;
            case "BloodOxygen":
                this.setState({ deviceIcon: "images/oximeter-JPD-500F-icon.png" });
                break;
            case "BloodPressure":
                if (this.props.model === "UA-767PBT-Ci") {
                    this.setState({ deviceIcon: "images/blood-pressure-UA-767BT-Ci-monitor-icon.png" });
                }
                else {
                    this.setState({ deviceIcon: "images/UA-651BLE-350x240.png" });
                }
                break;
            case "Weight":
                this.setState({ deviceIcon: "images/blood-pressure-monitor-icon.png" });
                break;
        }
    }
    handleDeviceItemClick(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        switch (this.props.modelType) {
            case "Temperature":
                Bridge.Redirect.redirectTo("Thermometer.html");
                break;
            case "BloodOxygen":
                Bridge.Redirect.redirectTo("BloodOxygen.html");
                break;
            case "BloodPressure":
                if (this.props.model === "UA-767PBT-Ci") {
                    Bridge.Redirect.redirectTo("UC-355PBT-Ci.html");
                }
                else {
                    Bridge.Redirect.redirectTo("BloodPressure.html");
                }
                break;
        }
    }
    render() {
        return <div>
            <div className="list-group-item" onClick={this.handleDeviceItemClick}>
                <div className="row">
                    <div className="col-xs-7">
                        <h4 className="primary-text">{this.props.model}</h4>
                        <p className="primary-text-secondary">{this.props.description}</p>
                    </div>
                    <div className="col-xs-5">
                        <img src={this.state.deviceIcon} className="img-responsive device-image" />
                    </div>
                </div>
            </div>
            <div className="list-group-separator full-width"></div>
        </div>
    }
}

class AddDeviceOverlay extends React.Component {
    /*getDefaultProps: function() {
        devices: []
    },*/
    showAddDeviceOverlay() {
        var addDeviceOverlayDiv = $(this.refs.addDeviceOverlay);

        addDeviceOverlayDiv.slideDown(250, "linear", function () {
            /*setTimeout(function() {*/
            Bridge.DeviceInstaller.showDevicePopup(function () {
                addDeviceOverlayDiv.slideUp();
            }
            );
            /*}, 200);*/
        });
    }
    hideAddDeviceOverlay() {
        var appointmentModalDiv = $(this.refs.addDeviceOverlay);
        appointmentModalDiv.slideUp(250, "linear", function () {
            /*setTimeout(function() {*/
            Bridge.DeviceInstaller.closeDevicePopup(function () {

            });
            /*}, 200);*/
        });
    }
    render() {
        var component = this;
        var devices = [];

        if (component.props.devices) {
            devices = component.props.devices;
        }
        return <div ref="addDeviceOverlay" className="addDeviceOverlay gray_200" onClick={this.hideAddDeviceOverlay}>
            <div className="space_24"></div>
            <div className="list-group" ref="addDeviceOverlayList">
                {devices.map(function (device) {
                    return <Device key={"available-" + device.model} imageUrl={device.imagesUrls[0]} model={device.model} description={device.description} modelType={device.deviceModelType} />;
                })}
            </div>
        </div>
    }
}

class PairedDevices extends React.Component {
    getDefaultProps() {
        devices: []
    }
    render() {
        return <div>
            <div className="space_24"></div>
            <div className="list-group">
                {
                    this.props.devices.map(function (device) {
                        return <PairedDevice key={"paired-" + device.model} imageUrl={device.imagesUrls[0]} model={device.model} description={device.description} modelType={device.deviceModelType} />;
                    })
                }
            </div>
        </div>
    }
}

class MyDevices extends React.Component {
    constructor() {
        this.state = {
            pairedDevices: [],
            devices: []
        }
    }

    handleAddDevice() {
        this.refs["addDeviceOverlay"].showAddDeviceOverlay();
    }

    componentDidMount() {
        var component = this;

        component.refs.noDevices.hideMessage();

        $(".addDeviceOverlay").height($("body").height());

        Bridge.getPatientDevices(function (devicesResult) {
            if (!devicesResult.success) {
                return;
            }
            else {
                Bridge.DeviceInstaller.getDevicesFromToLocalStorage(function (pairedResult) {
                    component.refs.noDevices.hideMessage();

                    if (!pairedResult.success) {
                        component.setState({ devices: devicesResult.data })
                        return;
                    }

                    component.setState({ pairedDevices: pairedResult.data, devices: devicesResult.data });
                    component.refs.noDevices.componentDidMount();


                });
            }

            indeterminateProgress.end();
        });
    }

    render() {
        return <div>
            <PairedDevices devices={this.state.pairedDevices} />

            <div className="bottom-container">
                <a href="javascript:void(0);" className="pull-right btn btn-fab btn-accent" onClick={this.handleAddDevice}><i className="material-icons accent">add</i><div className="ripple-container"></div></a>
            </div>
        </div>
    }
}


