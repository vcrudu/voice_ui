import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import PropTypes from 'prop-types';
import VitalSignsFactory from '../../model/VitalSignsFactory';
import apiService from '../../model/apiService';
import moment from 'moment';
import _ from 'underscore';
import * as d3 from "d3";
import bleService from '../../model/bleService';
import './styles/charts.scss'
import LeafHeader from '../shared/leafHeader';
import healthKitService from '../../model/healthKitService';
import '@rmwc/circular-progress/circular-progress.css';
import { CircularProgress } from '@rmwc/circular-progress';
import { LinearProgress } from '@rmwc/linear-progress';

import {
    Card,
    CardPrimaryAction,
    CardMedia,
    CardAction,
    CardActions,
    CardActionButtons,
    CardActionIcons
} from '@rmwc/Card';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
} from '@rmwc/dialog';

import { Fab } from '@rmwc/Fab';

import { Typography } from '@rmwc/Typography';
import DemoConversation from '../../demoConversation'

class NoVitalSignsMessage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Card className="signs-content">
                    <div style={{ padding: '0 1rem 1rem 1rem' }}>
                        <Typography use="title" tag="h2">Vital Signs</Typography>
                        <Typography use="body1" tag="div" theme="text-secondary-on-background">Use assistant to take blood pressure measurement.</Typography>
                    </div>
                    <CardActions>
                        <CardActionButtons>
                            <Link to={{
                                pathname: '/stage/home/true'
                            }}>
                                <CardAction>Stat assistant</CardAction>
                            </Link>
                        </CardActionButtons>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

class VitalSignChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            xAxis: undefined,
            x: undefined,
            x2: undefined,
            zoom: undefined,
            focus: undefined,
            brush: undefined,
            /*area: undefined,*/
            svg: undefined
        };

        this.zoom = this.zoom.bind(this);
    }

    fillLines(g, data, x, y, numticks, width) {
        g.selectAll("line").remove();

        g.selectAll("line").data(data).enter().append("line")
            .attr("class", "circles-line")
            .attr("x1", function (d) {
                return x(d.dateTime);
            })
            .attr("y1", function (d) {
                return y(d.line.y1);
            })
            .attr("x2", function (d) {
                return x(d.dateTime);
            })
            .attr("y2", function (d) {
                return y(d.line.y2);
            });

        var yAxisGrid = d3.svg.axis().scale(y)
            .orient("right")
            .ticks(numticks)
            .tickSize(width, 0)
            .tickFormat("");

        g.append("g")
            .classed('y', true)
            .classed('grid', true)
            .call(yAxisGrid);
    }

    fillCircles(g, tip, data, x, y) {
        g.selectAll('circle').remove();
        g.selectAll("circle").data(data).enter().append("circle")
            .attr("cx", function (d) { return x(d.dateTime); })
            .attr("cy", function (d) { return y(d.value); })
            .attr("r", 12)
            .attr("class", 'circle')
            .attr("data-legend", function (d) { return d.label })
            .style("fill", function (d) { return d.color; })
            .on("click", function (d) { /*tip.show(d);*/ d3.select(this).style("stroke", d.color).style("fill", "white").style("stroke-width", 2); })
            .on("mouseout", function (d) { /*tip.hide(d);*/ d3.select(this).style("stroke", "black").style("fill", d.color).style("stroke-width", 0); });
    }

    removeDuplicate(arrayOfStrings) {
        var uniqueArray = _.uniq(arrayOfStrings, function (item) {
            return moment(item).format("YYYY-MM-DD");
        });
        if (uniqueArray && uniqueArray.length > 0) {
            var itemFirst = uniqueArray[0];
            var itemLast = uniqueArray[uniqueArray.length - 1];

            var uniqueArrayOfDates = [];

            for (var i = 0; i < uniqueArray.length; i++) {

                uniqueArrayOfDates.push(moment(new Date(uniqueArray[i])).startOf('day')._d);

                if (i == uniqueArray.length - 1) {
                    var date = moment(new Date(uniqueArray[i])).startOf('day').add(24, "hours");
                    uniqueArrayOfDates.push(date._d);
                }
            }
            return uniqueArrayOfDates;
        }

        return [];
    }

    drawGraphic(props) {
        var component = this;
        var chartRef = this.graphic;
        var chartContextRef = this.graphicContext;
        var graphicWrapper = this.graphicWrapper;

        var margin = { top: 10, right: 15, bottom: 25, left: 35 };
        var width = chartRef.offsetWidth; //- margin.left - margin.right);
        var height = chartRef.offsetHeight; //Math.ceil((width * props.aspectHeight) / props.aspectWidth) - margin.top - margin.bottom;
        var height2 = Math.ceil((width * 2) / props.aspectWidth) - margin.top - margin.bottom;

        var num_ticks = props.ticks;

        if (chartRef.offsetWidth < props.mobileThreshold) {
            num_ticks = props.mobileTicks;

            height2 = Math.ceil((width * 3) / props.aspectWidth) - margin.top - margin.bottom;
        }

        // clear out existing graphics
        chartRef.innerHTML = "";
        chartContextRef.innerHTML = "";

        var data = [];
        var dataXTickValues = [];

        if (props.type != "bloodPressure") {
            var tempArray1 = [];
            for (var i = 0; i < props.dataSource.values.length; i++) {
                tempArray1.push({
                    dateTime: moment(props.dataSource.values[i].time),
                    value: props.dataSource.values[i].value,
                    color: "#7E57C2",
                    label: props.dataSource.label
                });

                dataXTickValues.push(moment(props.dataSource.values[i].time).format("YYYY-MM-DDThh:mm:ss"));
            }
            data = tempArray1;
        }
        else {
            var tempArray = [];
            for (var i = 0; i < props.dataSource.values.length; i++) {
                tempArray.push({
                    dateTime: moment(props.dataSource.values[i].time),
                    value: props.dataSource.values[i].value.systolic,
                    line: {
                        y1: props.dataSource.values[i].value.systolic,
                        y2: props.dataSource.values[i].value.diastolic
                    },
                    color: "red",
                    label: props.dataSource.label
                });

                tempArray.push({
                    dateTime: moment(props.dataSource.values[i].time),
                    value: props.dataSource.values[i].value.diastolic,
                    line: {
                        y1: props.dataSource.values[i].value.systolic,
                        y2: props.dataSource.values[i].value.diastolic
                    },
                    color: "#7E57C2",
                    label: props.dataSource.label
                });

                dataXTickValues.push(moment(props.dataSource.values[i].time).format("YYYY-MM-DDThh:mm:ss"));
            }
            data = tempArray;
        }

        this.y_margin = 10;

        this.yScale = d3.scaleLinear().domain([50, 200]).range([height - this.y_margin, this.y_margin]);
        this.yAxis = d3.axisLeft().scale(this.yScale).ticks(4);

        this.dateTimeExtent = d3.extent(data, d => d.dateTime);
        this.dateTimeExtent[1] = moment(this.dateTimeExtent[1]).endOf('day');
        this.xScale = d3.scaleTime().domain(this.dateTimeExtent).range([40, width - 10]);
        this.xAxis = d3.axisTop().scale(this.xScale);

        this.svg = d3.select(chartRef)
            .append("svg")
            .attr('width', width)
            .attr('height', height)
            .call(d3.zoom().on("zoom", this.zoom));

        this.y_axis = this.svg.append("g").attr("id", "yAxisG").call(this.yAxis).attr("transform", "translate(25, 0)");

        this.x_axis = this.svg.append("g").attr("id", "xAxisG").call(this.xAxis).attr("transform", "translate(0," + (height) + ")");

        this.svg.selectAll("#xAxisG text")  // select all the text elements for the xaxis
            .attr("transform", function (d) {
                return "translate(15,-10) rotate(-45)";
            });

        this.systolicTexts = this.svg.selectAll("circle")
            .data(data).enter()
            .append("text")
            .attr("x", d => this.xScale(d.dateTime) + 5)
            .attr("y", d => this.yScale(d.line.y1))
            .style("fill", "red")
            .style("font-size", 10)
            .text(d => d.line.y1);

        this.diastolicTexts = this.svg.selectAll("circle")
            .data(data).enter()
            .append("text")
            .attr("x", d => this.xScale(d.dateTime) + 5)
            .attr("y", d => this.yScale(d.line.y2))
            .style("fill", "red")
            .style("font-size", 10)
            .text(d => d.line.y2);

        this.lines = this.svg.selectAll("circle")
            .data(data).enter()
            .append("line")
            .attr("x1", d => this.xScale(d.dateTime))
            .attr("y1", d => this.yScale(d.line.y1))
            .attr("x2", d => this.xScale(d.dateTime))
            .attr("y2", d => this.yScale(d.line.y2))
            .style("stroke", "red");

        this.circles = this.svg.selectAll("circle")
            .data(data).enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", d => this.xScale(d.dateTime))
            .attr("cy", d => this.yScale(d.value))
            .attr("fill", d => d.color);

        /* svg.append("line")          // attach a line
        .style("stroke", "black")  // colour the line
        .attr("x1", 0)     // x position of the first end of the line
        .attr("y1", props.dataSource.A)      // y position of the first end of the line
        .attr("x2", 10)     // x position of the second end of the line
        .attr("y2", props.dataSource.b*10+props.dataSource.A);       */
    }

    zoom() {
        // re-scale y axis during zoom; ref [2]
        this.x_axis.transition()
            .duration(50)
            .call(this.xAxis.scale(d3.event.transform.rescaleX(this.xScale)));

            
        // re-draw circles using new x-axis scale; ref [3]
        var new_xScale = d3.event.transform.rescaleX(this.xScale);
        this.circles.attr("cx", function (d) { return new_xScale(d.dateTime); });
        this.lines.attr("x1", function (d) { return new_xScale(d.dateTime); }).attr("x2", function (d) { return new_xScale(d.dateTime); });
        this.systolicTexts.attr("x", function (d) { return new_xScale(d.dateTime) + 5; });
        this.diastolicTexts.attr("x", function (d) { return new_xScale(d.dateTime) + 5; });
        this.svg.selectAll("#xAxisG text")  // select all the text elements for the xaxis
            .attr("transform", function (d) {
                return "translate(15,-10) rotate(-45)";
            });
    }

    componentDidMount() {
        var component = this;
        if (this.props.dataSource.values.length > 0)
            component.drawGraphic(component.props);

        /* $(window).resize(function () {
            component.drawGraphic(component.props);
        }); */

    }

    componentDidUpdate(prevProps, prevState) {
        var component = this;
        if (this.props.dataSource.values.length > 0)
            component.drawGraphic(component.props);
    }

    render() {
        if (this.props.dataSource.values.length == 0) return null;
        else {
            return (<div style={{}} ref={(div) => { this.graphicWrapper = div; }}>
                <Card   >
                    <div style={{ padding: '0 1rem 1rem 1rem' }}>
                        <Typography use="title" tag="h2">{this.props.label}</Typography>
                    </div>
                    <div style={{ height: '35vh', margin: '2px' }} id="graphic" ref={(div) => { this.graphic = div; }}>
                    </div>
                    <div className="graphic" id="graphicContext" ref={(div) => { this.graphicContext = div; }}></div>
                </Card>
            </div>);
        }
    }
}

VitalSignChart.defaultProps = {
    aspectWidth: 16,
    aspectHeight: 9,
    mobileThreshold: 500,
    ticks: 10,
    mobileTicks: 5,
    type: undefined,
    minValue: 0,
    yDelta: 0,
    label: "",
    unit: ""
};

VitalSignChart.propTypes = {
    aspectWidth: PropTypes.number.isRequired,
    aspectHeight: PropTypes.number.isRequired,
    mobileThreshold: PropTypes.number.isRequired
};

class BpComponent extends React.Component {
    constructor(props) {
        super(props);

        this.demoConversation = new DemoConversation();
        this.state = {newHealthKitData: false};
        this.onFabClick = this.onFabClick.bind(this);
        this.showDetails = this.showDetails.bind(this);
    }

    onFabClick() {
        this.setState({ redirect: 'go' });
        this.props.actions.setCurrentChatCommand({ message: "Let's measure your blood pressure", measureType: 'bp' });
    }

    showDetails() {
        this.setState((state) => {
            let bloodPressureDef = JSON.parse(JSON.stringify(this.state.bloodPressureDef));
            bloodPressureDef.values = state.details ? bloodPressureDef.avv : bloodPressureDef.details;
            return {
                bloodPressureDef: bloodPressureDef,
                details: !state.details
            }
        });
    }

    componentDidMount() {
        this.setState({ redirect: null });
        apiService.getPatientVitalSigns(this.props.userData.token, (error, response) => {
            if (response.success) {
                var newDataSource = VitalSignsFactory.createVitalSings(response.data);
                this.setState(
                    {
                        temperatureVitalSignsDef: newDataSource.temperatureVitalSignsDef,
                        bloodPressureDef: newDataSource.bloodPressureDef,
                        bloodOxygenDef: newDataSource.bloodOxygenDef,
                        heartRateDef: newDataSource.heartRateDef,
                        weightDef: newDataSource.weightDef,
                        haveData: newDataSource && newDataSource.bloodPressureDef.values.length > 0
                    });
            }
        });

        if (healthKitService.isAvailable()) {
            let startDate = moment(this.props.healthKitSyncDate).toDate();
            healthKitService.queryData(startDate, "blood_pressure", (data) => {
                if (data && data.length > 0) {
                    const syncHealthKitEndDate =
                        moment(data[data.length - 1].endDate).valueOf();
                    if (syncHealthKitEndDate > this.props.healthKitSyncDate) {
                        this.setState({
                            newHealthKitData: data,
                            syncHealthKitEndDate: syncHealthKitEndDate,
                            newHealthKitDataDialog: true
                        });
                    }
                }
            }, (err) => {
                console.log(JSON.stringify(err));
            });
        }
    }

    yesImport() {
        this.setState({ synching: true, newHealthKitDataDialog: false });
        const events = this.state.newHealthKitData.map((healthKitItem) => {
            return {
                bloodPressure: {
                    diastolic: healthKitItem.value.diastolic,
                    systolic: healthKitItem.value.systolic
                },
                measurementDateTime: moment(healthKitItem.startDate).valueOf(),
                deviceModelType: "BloodPressure"
            };
        });
        apiService.sendBulkEvents(this.props.userData.token,
            events,
            (err, response) => {
                console.log(err);
                if (!err) {
                    this.setState({
                        newHealthKitData: null,
                        newHealthKitDataDialog: false,
                        newHealthKitDataCompletedDialog: true,
                        synching: false,
                        resultText: "Information was imported successfully."
                    });
                    this.props.actions.updateHealthKitSyncDate(this.state.syncHealthKitEndDate);
                    apiService.getPatientVitalSigns(this.props.userData.token, (error, response) => {
                        if (response.success) {
                            var newDataSource = VitalSignsFactory.createVitalSings(response.data);
                            this.setState(
                                {
                                    temperatureVitalSignsDef: newDataSource.temperatureVitalSignsDef,
                                    bloodPressureDef: newDataSource.bloodPressureDef,
                                    bloodOxygenDef: newDataSource.bloodOxygenDef,
                                    heartRateDef: newDataSource.heartRateDef,
                                    weightDef: newDataSource.weightDef,
                                    haveData: newDataSource && newDataSource.bloodPressureDef.values.length > 0
                                });
                        }
                    });
                } else {
                    this.setState({
                        newHealthKitData: null,
                        newHealthKitDataDialog: false,
                        newHealthKitDataCompletedDialog: true,
                        synching: false,
                        resultText: "There was an error during importing. Please try again latter."
                    });
                }
            }
        )
    }

    noImport(){
        this.setState({newHealthKitData:null, newHealthKitDataDialog: false});
    }

    okImportCompleted(){
        this.setState({
            newHealthKitDataCompletedDialog: false
        });
    }

    render() {
        if (!this.state.bloodPressureDef) return null;
        if (this.state.redirect) {
            const chatUrl = `/chat/bp/${'MeasureBP'}/${moment().valueOf()}/Blood Pressure`;
            const voiceUrl = `/voice/bp/${'MeasureBP'}/${moment().valueOf()}/Blood Pressure}`;
            let url = this.props.voice.voiceState === 'off' ? chatUrl : voiceUrl;
            return <Redirect to={url} />
        } else
            return (
                <div>
                    <LeafHeader backUrl='/stage/signs' title='Blood pressure' />
                    <div className="signs-content" ref={div => this.chartsWrapper = div}>
                        <Fab style={{ position: 'fixed', top: '15vh', right: '6vw', width: '8vw', height: '8vw' }}
                            icon="line_style" mini onClick={this.showDetails} />
                        <Fab style={{ position: 'fixed', bottom: '15vh', right: '5vh' }} icon='add'
                            onClick={() => {
                                this.onFabClick();
                            }}
                        ></Fab>
                        <VitalSignChart dataSource={this.state.bloodPressureDef}
                            aspectWidth={16}
                            aspectHeight={9}
                            ticks={10}
                            mobileThreshold={500}
                            mobileTicks={5}
                            type={this.state.bloodPressureDef.measurementType}
                            minValue={this.state.bloodPressureDef.minValue}
                            yDelta={50}
                            label={this.state.bloodPressureDef.label}
                            unit={this.state.bloodPressureDef.unit} />
                        <Dialog open={this.state.newHealthKitDataDialog}>
                            <DialogTitle>Sync</DialogTitle>
                            <DialogContent>There are new measures in Health Kit repository, would you like to import the measures into our platform?</DialogContent>
                            <DialogActions>
                                <DialogButton onClick={()=>this.yesImport()} isDefaultAction>Yes</DialogButton>
                                <DialogButton onClick={()=>this.noImport()}>No</DialogButton>
                            </DialogActions>
                        </Dialog>
                        <Dialog open={this.state.newHealthKitDataCompletedDialog}>
                            <DialogTitle>Sync</DialogTitle>
                            <DialogContent>Information was imported successfully.</DialogContent>
                            <DialogActions>
                                <DialogButton onClick={()=>this.okImportCompleted()} isDefaultAction>Ok</DialogButton>
                            </DialogActions>
                        </Dialog>
                        {
                            this.state.synching?
                            (<LinearProgress determinate={false}/>):null
                            
                            /* style={{ Circular progress
                                position: 'relative',
                                left: '35vw',
                                bottom: '30vh'
                            }} */
                        }
                    </div>
                </div>
            );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const mapStateToProps = state => {
    return {
        userData: state.userData,
        navigationState: state.navigationState,
        currentChatCommand: state.currentChatCommand,
        voice: state.voiceState,
        healthKitSyncDate: state.healthKitSyncDate
    };
}

const Bp = connect(
    mapStateToProps,
    mapDispatchToProps
)(BpComponent);

export default withRouter(Bp);