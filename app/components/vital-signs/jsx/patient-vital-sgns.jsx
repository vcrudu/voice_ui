/**
 * Created by Victor on 2/25/2016.
 */
(function() {
    "use strict";

    var intObj = {
        template: 3,
        parent: ".progress-bar-indeterminate"
    };
    var indeterminateProgress = new Mprogress(intObj);

    var VITAL_SINGS_PROGRESS = React.createClass({
        componentDidMount: function() {
            indeterminateProgress.start();
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
        },
        render: function() {
            return <div className="progress-bar-indeterminate"></div>
        }
    });

    var NoVitalSignsMessage = React.createClass({
        componentDidMount: function() {
            /*$(this.refs.noVitalsSingsMessage).hide();*/
        },
        hideMessage: function(){
            $(this.refs.noVitalsSingsMessage).addClass("hide");
        },
        showMessage: function(){
            $(this.refs.noVitalsSingsMessage).removeClass("hide");
        },
        handleTakeMeasurements: function(){
            this.props.handleGoToMyDevices();
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();

            var goToMyDevicesButton = this.refs.goToMyDevicesButton;
            goToMyDevicesButton.addEventListener('click', this.handleTakeMeasurements);
        },
        render: function() {
            return <div className="mdl-card mdl-shadow--2dp hide" ref="noVitalsSingsMessage">
                    <div className="mdl-card__title">
                        <h2 className="mdl-card__title-text">Welcome</h2>
                    </div>
                    <div className="mdl-card__supporting-text">
                        Please take some measurements to be able to see history.
                    </div>
                    <div className="buttons-container-right">
                        <button className="mdl-button mdl-js-button mdl-button--accent go-to-my-devices-button" ref="goToMyDevicesButton">
                            GO TO MY DEVICES
                        </button>
                    </div>
            </div>
        }
    });

    var VitalSingChart = React.createClass({
        propTypes: {
            aspectWidth: React.PropTypes.number.isRequired,
            aspectHeight: React.PropTypes.number.isRequired,
            mobileThreshold: React.PropTypes.number.isRequired
        },
        getDefaultProps: function() {
            return {
                aspectWidth: 16,
                aspectHeight: 9,
                mobileThreshold: 500,
                ticks: 10,
                mobileTicks: 5,
                type:undefined,
                minValue:0,
                yDelta:0,
                label:"",
                unit:""
            };
        },
        getInitialState: function() {
            return {
                xAxis: undefined,
                x: undefined,
                x2: undefined,
                zoom: undefined,
                focus: undefined,
                brush: undefined,
                /*area: undefined,*/
                svg: undefined,
            }
        },
        fillLines: function(g, data, x, y, numticks, width) {
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
        },
        fillCircles: function(g, tip, data, x, y) {
            g.selectAll('circle').remove();
            g.selectAll("circle").data(data).enter().append("circle")
                .attr("cx", function(d) { return x(d.dateTime); })
                .attr("cy", function(d) { return y(d.value); })
                .attr("r", 12)
                .attr("class", 'circle')
                .attr("data-legend",function(d) { return d.label})
                .style("fill", function(d) { return d.color; })
                .on("click", function(d){ tip.show(d); d3.select(this).style("stroke", d.color).style("fill", "white").style("stroke-width", 2); } )
                .on("mouseout", function(d){ tip.hide(d); d3.select(this).style("stroke", "black").style("fill", d.color).style("stroke-width", 0); } );
        },
        removeDuplicate: function(arrayOfStrings){
            var uniqueArray = _.uniq(arrayOfStrings, function (item) {
                return moment(item).format("YYYY-MM-DD");
            });
            if (uniqueArray && uniqueArray.length > 0) {
                var itemFirst = uniqueArray[0];
                var itemLast = uniqueArray[uniqueArray.length - 1];

                var uniqueArrayOfDates = [];

                for(var i=0;i<uniqueArray.length;i++) {

                    uniqueArrayOfDates.push(moment(new Date(uniqueArray[i])).startOf('day')._d);

                    if (i == uniqueArray.length - 1) {
                        var date = moment(new Date(uniqueArray[i])).startOf('day').add(24, "hours");
                        uniqueArrayOfDates.push(date._d);
                    }
                }
                return uniqueArrayOfDates;
            }

            return [];
        },
        drawGraphic: function(props)
        {
            var component = this;
            var chartRef = $(this.refs.graphic);
            var chartContextRef = $(this.refs.graphicContext);
            var graphicWrapper = $(this.refs.graphicWrapper);

            if (!props.dataSource || !props.dataSource.values || props.dataSource.values.length == 0) {
                graphicWrapper.hide();
                return;
            }
            else {
                graphicWrapper.show();
            }

            var margin = { top: 10, right: 15, bottom: 25, left: 35 };
            var width = (chartRef.width() - margin.left - margin.right);
            var height = Math.ceil((width * props.aspectHeight) / props.aspectWidth) - margin.top - margin.bottom;
            var height2 = Math.ceil((width * 2) / props.aspectWidth) - margin.top - margin.bottom;

            var num_ticks = props.ticks;

            if (chartRef.width() < props.mobileThreshold) {
                num_ticks = props.mobileTicks;

                height2 = Math.ceil((width * 3) / props.aspectWidth) - margin.top - margin.bottom;
            }

            // clear out existing graphics
            chartRef.empty();
            chartContextRef.empty();

            var data = [];
            var dataXTickValues = [];

            if (props.type != "bloodPressure") {
                var tempArray1 = [];
                for(var i=0; i<props.dataSource.values.length;i++) {
                    tempArray1.push({
                        dateTime: moment(props.dataSource.values[i].time),
                        value: props.dataSource.values[i].value,
                        color:"#7E57C2",
                        label: props.dataSource.label
                    });

                    dataXTickValues.push(moment(props.dataSource.values[i].time).format("YYYY-MM-DDThh:mm:ss"));
                }
                data = tempArray1;
            }
            else {
                var tempArray = [];
                for(var i=0; i<props.dataSource.values.length;i++) {
                    tempArray.push({
                        dateTime: moment(props.dataSource.values[i].time),
                        value: props.dataSource.values[i].value.systolic,
                        line: {
                            y1:props.dataSource.values[i].value.systolic,
                            y2:props.dataSource.values[i].value.diastolic
                        },
                        color:"#311B92",
                        label: props.dataSource.label
                    });

                    tempArray.push({
                        dateTime: moment(props.dataSource.values[i].time),
                        value: props.dataSource.values[i].value.diastolic,
                        line: {
                            y1:props.dataSource.values[i].value.systolic,
                            y2:props.dataSource.values[i].value.diastolic
                        },
                        color:"#7E57C2",
                        label: props.dataSource.label
                    });

                    dataXTickValues.push(moment(props.dataSource.values[i].time).format("YYYY-MM-DDThh:mm:ss"));
                }
                data = tempArray;
            }

            var uniqueArray = this.removeDuplicate(dataXTickValues);

            var x = d3.time.scale().range([0, width]),
                x2 = d3.time.scale().range([0, width]),
                y = d3.scale.linear().range([height, 0]),
                y2 = d3.scale.linear().range([height2, 0]);

            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(function(d,i) {
                    if (i == 0 || i == uniqueArray.length - 1) {
                        return "";
                    }

                    var fmt = d3.time.format('%b-%d');
                    return fmt(d);

                }).tickValues(uniqueArray),
                xAxis2 = d3.svg.axis().scale(x2).orient("bottom").tickFormat(function(d,i) {
                    if (i == 0 || i == uniqueArray.length - 1) {
                        return "";
                    }

                    var fmt = d3.time.format('%b-%d');
                    return fmt(d);

                }).tickValues(uniqueArray);

            var yAxis = d3.svg.axis().scale(y).orient("left").ticks(num_ticks);

            var zoom = d3.behavior.zoom().on("zoom", function() {
                tip.hide();
                focus.selectAll('circle')
                    .attr('cx', function(d) { return x(d.dateTime); })
                    .attr('cy', function(d) { return y(d.value); });

                if (props.type == "bloodPressure") {
                    component.fillLines(focus, data, x, y, num_ticks, width);
                }

                component.fillCircles(focus, tip, data, x, y);

                focus.select(".x.grid").call(xAxis);

                // Force changing brush range
                brush.extent(x.domain());

                svg1.select(".brush").call(brush);
            });

            var svg = d3.select(chartRef[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .call(zoom);

            svg.append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            var focus = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Set up zoom behavior
            zoom.x(x);

            var svg1 = d3.select(chartContextRef[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height2 + margin.top + margin.bottom);

            var context = svg1.append("g")
                .attr("class", "context")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return d.value + " " + props.unit + " on " + moment(d.dateTime).format("MM/DD hh:mm");
                });

            svg.call(tip);

            var brush = d3.svg.brush()
                .x(x2)
                .on("brush", function() {
                    tip.hide();
                    x.domain(brush.empty() ? x2.domain() : brush.extent());

                    if (props.type == "bloodPressure") {
                        component.fillLines(focus, data, x, y, num_ticks, width);
                    }

                    component.fillCircles(focus, tip, data, x, y);

                    focus.select(".x.axis").call(xAxis);

                    // Reset zoom scale', s domain
                    zoom.x(x);
                });

            //x.domain(d3.extent(data, function(d) { return d.dateTime; }));

            x.domain([d3.min(uniqueArray, function(d) {
                        return d;
                    }
                ),
                d3.max(uniqueArray, function(d) {
                        return d;
                    }
                )]);

            y.domain(
                [props.minValue,
                    d3.max(data, function(d) {
                            var n = d.value;
                            return Math.ceil(n) + props.yDelta;
                        }
                    )]);

            x2.domain(x.domain());
            y2.domain(y.domain());

            zoom.x(x);

            if (props.type != "bloodPressure") {
                var yAxisGrid = d3.svg.axis().scale(y)
                    .orient("right")
                    .ticks(num_ticks)
                    .tickSize(width, 0)
                    .tickFormat("");

                focus.append("g")
                    .classed('y', true)
                    .classed('grid', true)
                    .call(yAxisGrid);
            }

            if (props.type == "bloodPressure") {
                component.fillLines(focus, data, x, y, num_ticks, width);
            }

            component.fillCircles(focus, tip, data, x, y);

            focus.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            focus.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            if (props.type != "bloodPressure") {
                context.selectAll('circle').data(data).enter().append("circle")
                    .attr("cx", function(d) { return x2(d.dateTime); })
                    .attr("cy", function(d) { return y2(d.value); })
                    .attr("r", 3)
                    .style("stroke", function(d) {return d.color;}).style("fill", "none").style("stroke-width", 2);
            }
            else {
                context.selectAll('circle').data(data).enter().append("circle")
                    .attr("cx", function(d) { return x2(d.dateTime); })
                    .attr("cy", function(d) { return y2(d.value); })
                    .attr("r", 3)
                    .style("stroke", function(d) {return d.color;}).style("fill", "none").style("stroke-width", 2);
            }
            context.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "x brush")
                .call(brush)
                .selectAll("rect")
                .attr("y", -6)
                .attr("height", height2 + 7);
        },
        componentDidMount: function() {
            var component = this;

            component.drawGraphic(component.props);

            $(window).resize(function() {
                component.drawGraphic(component.props);
            });

        },
        componentDidUpdate: function(prevProps, prevState){
            var component = this;
            component.drawGraphic(component.props);
        },
        render: function() {
            return <div className="chart-card-square mdl-card mdl-shadow--2dp" ref="graphicWrapper">
                <div className="mdl-card__title">
                    <h2 className="mdl-card__title-text">{this.props.label}</h2>
                </div>
                <div className="mdl-card__supporting-text">
                    <div className="graphic" id="graphic" ref="graphic"></div>

                </div>
                <div className="mdl-card__actions mdl-card--border">
                    <div className="graphic" id="graphicContext" ref="graphicContext"></div>
                </div>
            </div>
        }
    });

    var PatientVitalSingsPage = React.createClass({
        getInitialState: function() {
            var emptyVitalSigns = VitalSignsFactory.createEmptyVitalSings();
            return {
                temperatureVitalSignsDef: emptyVitalSigns.temperatureVitalSignsDef,
                bloodPressureDef: emptyVitalSigns.temperatureVitalSignsDef,
                bloodOxygenDef: emptyVitalSigns.bloodOxygenDef,
                heartRateDef: emptyVitalSigns.heartRateDef,
                weightDef: emptyVitalSigns.weightDef
            }
        },
        goToMyDevices: function() {
            Bridge.Redirect.redirectToWithLevelsUp("devices/patient-my-devices.html", 2);
        },
        componentDidMount: function() {
            var chartsWrapper = $(this.refs.chartsWrapper);

            var component = this;
            if (Modernizr.svg) { // if svg is supported, draw dynamic chart

                var vitalSigns = Bridge.getPatientVitalSigns(function(result) {
                    if (result.success) {
                        var newDataSource = VitalSignsFactory.createVitalSings(result.data);
                        component.setState(
                            {
                                temperatureVitalSignsDef: newDataSource.temperatureVitalSignsDef,
                                bloodPressureDef: newDataSource.bloodPressureDef,
                                bloodOxygenDef: newDataSource.bloodOxygenDef,
                                heartRateDef: newDataSource.heartRateDef,
                                weightDef: newDataSource.weightDef
                            });

                        if (newDataSource
                            && (newDataSource.temperatureVitalSignsDef.values.length > 0
                                || newDataSource.bloodPressureDef.values.length > 0
                                || newDataSource.bloodOxygenDef.values.length > 0
                                || newDataSource.heartRateDef.values.length > 0
                                || newDataSource.weightDef.values.length > 0)) {

                            component.refs.noVitalSigns.hideMessage();
                        }
                        else {
                            component.refs.noVitalSigns.showMessage();
                        }
                        indeterminateProgress.end();
                    }
                });
            }
        },
        render: function() {
            return <div ref="chartsWrapper">
                <NoVitalSignsMessage ref="noVitalSigns" handleGoToMyDevices={this.goToMyDevices}/>
                <VitalSingChart dataSource={this.state.bloodPressureDef}
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
                <VitalSingChart dataSource={this.state.temperatureVitalSignsDef}
                                aspectWidth={16}
                                aspectHeight={9}
                                ticks={10}
                                mobileThreshold={500}
                                mobileTicks={5}
                                type={this.state.temperatureVitalSignsDef.measurementType}
                                minValue={this.state.temperatureVitalSignsDef.minValue}
                                yDelta={1}
                                label={this.state.temperatureVitalSignsDef.label}
                                unit={this.state.temperatureVitalSignsDef.unit} />
                <VitalSingChart dataSource={this.state.bloodOxygenDef}
                                aspectWidth={16}
                                aspectHeight={9}
                                ticks={10}
                                mobileThreshold={500}
                                mobileTicks={5}
                                type={this.state.bloodOxygenDef.measurementType}
                                minValue={this.state.bloodOxygenDef.minValue}
                                yDelta={5}
                                label={this.state.bloodOxygenDef.label}
                                unit={this.state.bloodOxygenDef.unit} />
                <VitalSingChart dataSource={this.state.heartRateDef}
                                aspectWidth={16}
                                aspectHeight={9}
                                ticks={10}
                                mobileThreshold={500}
                                mobileTicks={5}
                                type={this.state.heartRateDef.measurementType}
                                minValue={this.state.heartRateDef.minValue}
                                yDelta={5}
                                label={this.state.heartRateDef.label}
                                unit={this.state.heartRateDef.unit} />
                <VitalSingChart dataSource={this.state.weightDef}
                                aspectWidth={16}
                                aspectHeight={9}
                                ticks={10}
                                mobileThreshold={500}
                                mobileTicks={5}
                                type={this.state.weightDef.measurementType}
                                minValue={this.state.weightDef.minValue}
                                yDelta={0}
                                label={this.state.weightDef.label}
                                unit={this.state.weightDef.unit} />
            </div>
        }
    });
    ReactDOM.render(<VITAL_SINGS_PROGRESS />, document.getElementById("patient-vital-sings-progress"));
    ReactDOM.render(<PatientVitalSingsPage />, document.getElementById("patient-vital-sings-container"));
})();