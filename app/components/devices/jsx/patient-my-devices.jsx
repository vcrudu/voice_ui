/**
 * Created by Victor on 3/2/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var intObj = {
        template: 3,
        parent: ".progress-bar-indeterminate"
    };
    var indeterminateProgress = new Mprogress(intObj);

    var MY_DEVICES_PROGRESS = React.createClass({
        componentDidMount: function() {
            indeterminateProgress.start();
        },
        componentDidUpdate: function() {
            //componentHandler.upgradeDom();
        },
        render: function() {
            return <div className="progress-bar-indeterminate"></div>
        }
    });

    var NoDevicesMessage = React.createClass({
        componentDidMount: function() {
            $(this.refs.noDeviceMessage).hide();
            if (this.props.pairedDevices && this.props.pairedDevices.length > 0) {
                $(this.refs.noDeviceMessage).hide();
            }
            else {
                $(this.refs.noDeviceMessage).show();
            }
            $(this.refs.noDeviceMessage).removeClass("hide");
        },
        hideMessage: function(){
            $(this.refs.noDeviceMessage).addClass("hide");
        },
        handleAddDevice: function(){
            this.props.handleInstallDevice();
        },
        render: function() {
            return <div className="container hide" ref="noDeviceMessage">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="bs-component">
                            <div className="jumbotron">
                                <h2 className="primary-title primary-text">Welcome</h2>
                                <p className="supporting-text">Add some devices to get started.</p>
                                <p className="supporting-text pull-right">
                                    <a href="javascript:void(0);" className="btn btn-primary btn-accent" onClick={this.handleAddDevice}>Install a new device</a>
                                </p>
                                <div className="clear"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    });

    var PairedDevice = React.createClass({
        getInitialState: function() {
            return {
                deviceIcon: "",
            }
        },
        componentDidMount: function() {
            switch (this.props.modelType)
            {
                case "Temperature":
                    this.setState({deviceIcon: "images/thermometer-icon.png"});
                    break;
                case "BloodOxygen":
                    this.setState({deviceIcon: "images/oximeter-JPD-500F-icon.png"});
                    break;
                case "BloodPressure":
                    if (this.props.model === "UA-767PBT-Ci") {
                        this.setState({deviceIcon: "images/blood-pressure-UA-767BT-Ci-monitor-icon.png"});
                    }
                    else {
                        this.setState({deviceIcon: "images/UA-651BLE-350x240.png"});
                    }
                    break;
                case "Weight":
                    this.setState({deviceIcon: "images/UC-355PBT-Ci.png"});
                    break;
            }
        },
        handleDeviceItemClick: function(e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            switch (this.props.modelType)
            {
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
        },
        render: function() {
            return <div>
                    <div className="list-group-item" onClick={this.handleDeviceItemClick}>
                        <div className="row">
                            <div className="col-xs-7">
                                <h4 className="primary-text">{this.props.model}</h4>
                                <p className="primary-text-secondary">{this.props.description}</p>
                            </div>
                            <div className="col-xs-5">
                                <img src={this.state.deviceIcon} className="img-responsive device-image"/>
                            </div>
                        </div>
                    </div>
                    <div className="list-group-separator full-width"></div>
                </div>
        }
    });

    var Device = React.createClass({
        getInitialState: function() {
            return {
                deviceIcon: "",
            }
        },
        componentDidMount: function() {
            debugger;
            switch (this.props.modelType)
            {
                case "Temperature":
                    this.setState({deviceIcon: "images/thermometer-icon.png"});
                    break;
                case "BloodOxygen":
                    this.setState({deviceIcon: "images/oximeter-JPD-500F-icon.png"});
                    break;
                case "BloodPressure":
                    if (this.props.model === "UA-767PBT-Ci") {
                        this.setState({deviceIcon: "images/blood-pressure-UA-767BT-Ci-monitor-icon.png"});
                    }
                    else {
                        this.setState({deviceIcon: "images/UA-651BLE-350x240.png"});
                    }
                    break;
                case "Weight":
                    this.setState({deviceIcon: "images/blood-pressure-monitor-icon.png"});
                    break;
            }
        },
        handleDeviceItemClick: function(e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            switch (this.props.modelType)
            {
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
        },
        render: function() {
            return <div>
                <div className="list-group-item" onClick={this.handleDeviceItemClick}>
                    <div className="row">
                        <div className="col-xs-7">
                            <h4 className="primary-text">{this.props.model}</h4>
                            <p className="primary-text-secondary">{this.props.description}</p>
                        </div>
                        <div className="col-xs-5">
                            <img src={this.state.deviceIcon} className="img-responsive device-image"/>
                        </div>
                    </div>
                </div>
                <div className="list-group-separator full-width"></div>
            </div>
        }
    });

    var AddDeviceOverlay = React.createClass({
        /*getDefaultProps: function() {
            devices: []
        },*/
        showAddDeviceOverlay: function() {
            var addDeviceOverlayDiv = $(this.refs.addDeviceOverlay);

            addDeviceOverlayDiv.slideDown(250, "linear", function() {
                /*setTimeout(function() {*/
                    Bridge.DeviceInstaller.showDevicePopup(function() {
                        addDeviceOverlayDiv.slideUp();}
                    );
                /*}, 200);*/
            });
        },
        hideAddDeviceOverlay: function() {
            var appointmentModalDiv = $(this.refs.addDeviceOverlay);
            appointmentModalDiv.slideUp(250, "linear", function() {
                /*setTimeout(function() {*/
                    Bridge.DeviceInstaller.closeDevicePopup(function() {

                    });
                /*}, 200);*/
            });
        },
        render: function() {
            var component = this;
            var devices = [];
            
            if (component.props.devices) {
                devices = component.props.devices;
            }
            return <div ref="addDeviceOverlay" className="addDeviceOverlay gray_200" onClick={this.hideAddDeviceOverlay}>
                <div className="space_24"></div>
                <div className="list-group" ref="addDeviceOverlayList">
                    {devices.map(function(device) {
                        return <Device key={"available-" + device.model} imageUrl={device.imagesUrls[0]} model={device.model} description={device.description} modelType={device.deviceModelType}/>;
                    })}
                </div>
            </div>
        }
    });

    var PairedDevices = React.createClass({
        getDefaultProps: function() {
            devices: []
        },
        render: function() {
            return <div>
                <div className="space_24"></div>
                <div className="list-group">
                    {
                        this.props.devices.map(function(device) {
                            return <PairedDevice key={"paired-" + device.model} imageUrl={device.imagesUrls[0]} model={device.model} description={device.description} modelType={device.deviceModelType}/>;
                        })
                    }
                </div>
            </div>
        }
    });

    var MyDevices = React.createClass({
        getInitialState: function(){
            return {
                pairedDevices: [],
                devices: []
            }
        },
        handleAddDevice: function(){
            this.refs["addDeviceOverlay"].showAddDeviceOverlay();
        },
        componentDidMount: function() {
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

                        if (!pairedResult.success)
                        {
                            component.setState({devices: devicesResult.data })
                            return;
                        }

                        component.setState({pairedDevices: pairedResult.data, devices: devicesResult.data });
                        component.refs.noDevices.componentDidMount();


                    });
                }

                indeterminateProgress.end();
            });
        },
        render: function() {
            return <div>
                <NoDevicesMessage ref="noDevices" pairedDevices={this.state.pairedDevices} handleInstallDevice={this.handleAddDevice} />
                <AddDeviceOverlay ref="addDeviceOverlay" devices={this.state.devices}/>
                <PairedDevices devices={this.state.pairedDevices}/>

                <div className="bottom-container">
                    <a href="javascript:void(0);" className="pull-right btn btn-fab btn-accent" onClick={this.handleAddDevice}><i className="material-icons accent">add</i><div className="ripple-container"></div></a>
                </div>
            </div>
        }
    });

    ReactDOM.render(<MY_DEVICES_PROGRESS/>, document.getElementById("my-devices-progress"));
    ReactDOM.render(<MyDevices/>, document.getElementById("my-devices"));
})();


