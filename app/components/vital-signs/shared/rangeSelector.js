import React from 'react';
import moment from 'moment';

class RangeSelector extends React.Component {
    constructor(props) {
        super(props);
        this.getCurrent = this.getCurrent.bind(this);
        this.isNextDisabled = this.isNextDisabled.bind(this);
        this.state = {
            currentWeekStart: moment().startOf('isoWeek'),
            currentMonthStart: moment().startOf('month'),
            currentYearStart: moment().startOf('year'),
            currentDayStart: moment().startOf('day')
        };
    }

    getCurrent(){
        switch(this.props.rangeType){
            case 'week':
                return `${this.state.currentWeekStart.format('DD MMM')} - ${moment(this.state.currentWeekStart).add(6, 'days').format('DD MMM YYYY')}`;
            case 'day':
                return `${this.state.currentDayStart.format('DD MMM YYYY')}`;
            case 'month':
                return `${this.state.currentMonthStart.format('MMM YYYY')}`;
            case 'year':
                return `${this.state.currentYearStart.format('YYYY')}`;
        }
    }

    previous() {
        this.setState((state, props) => {
            let following;
            switch (props.rangeType) {
                case 'week':
                    following = moment(state.currentWeekStart)
                    following.subtract(1, 'week');
                    return {
                        currentWeekStart: following,
                        currentMonthStart: moment().startOf('month'),
                        currentYearStart: moment().startOf('year'),
                        currentDayStart: moment().startOf('day')
                    }
                case 'month':
                    following = moment(state.currentMonthStart)
                    following.subtract(1, 'month');
                    return {
                        currentMonthStart: following,
                        currentWeekStart: moment().startOf('isoWeek'),
                        currentYearStart: moment().startOf('year'),
                        currentDayStart: moment().startOf('day')
                    }
                case 'year':
                    following = moment(state.currentYearStart)
                    following.subtract(1, 'year');
                    return {
                        currentYearStart: following,
                        currentWeekStart: moment().startOf('isoWeek'),
                        currentMonthStart: moment().startOf('month'),
                        currentDayStart: moment().startOf('day')
                    }
                case 'day':
                    following = moment(state.currentDayStart)
                    following.subtract(1, 'day');
                    return {
                        currentDayStart: following,
                        currentWeekStart: moment().startOf('isoWeek'),
                        currentMonthStart: moment().startOf('month'),
                        currentYearStart: moment().startOf('year')
                    }
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.rangeType !== prevProps.rangeType) {
            switch (prevProps.rangeType) {
                case 'day':
                    this.setState((prevState) => {
                        return {
                            currentWeekStart: moment(prevState.currentDayStart).startOf('isoWeek'),
                            currentMonthStart: moment(prevState.currentMonthStart).startOf('month'),
                            currentYearStart: moment(prevState.currentYearStart).startOf('year'),
                        }
                    });
                    return;
                    case 'week':
                            this.setState((prevState) => {
                                return {
                                    currentDayStart: moment(prevState.currentWeekStart).add(3,'days'),
                                    currentMonthStart: moment(prevState.currentWeekStart).startOf('month'),
                                    currentYearStart: moment(prevState.currentWeekStart).startOf('year'),
                                }
                            });
                            return;
                    case 'month':
                            this.setState((prevState) => {
                                return {
                                    currentDayStart: moment(prevState.currentMonthStart).add(15,'days'),
                                    currentWeekStart: moment(prevState.currentMonthStart).add(15,'days').startOf('isoWeek'),
                                    currentYearStart: moment(prevState.currentMonthStart).startOf('year'),
                                }
                            });
                            return;
                    case 'year':
                            this.setState((prevState) => {
                                return {
                                    currentDayStart: moment().startOf('day'),
                                    currentWeekStart: moment().startOf('isoWeek'),
                                    currentMonthStart: moment().startOf('month'),
                                }
                            });
                            return;
            }
        }
    }

    next() {
        let isNextDisabled = this.isNextDisabled();
        if(isNextDisabled) return;
        this.setState((state, props) => {
            let following;
            switch (props.rangeType) {
                case 'week':
                    following = moment(state.currentWeekStart)
                    following.add(1, 'week');
                    return {
                        currentWeekStart: following,
                        currentMonthStart: moment().startOf('month'),
                        currentYearStart: moment().startOf('year'),
                        currentDayStart: moment().startOf('day')
                    }
                case 'month':
                    following = moment(state.currentMonthStart)
                    following.add(1, 'month');
                    return {
                        currentMonthStart: following,
                        currentWeekStart: moment().startOf('isoWeek'),
                        currentYearStart: moment().startOf('year'),
                        currentDayStart: moment().startOf('day')
                    }
                case 'year':
                    following = moment(state.currentYearStart)
                    following.add(1, 'year');
                    return {
                        currentYearStart: following,
                        currentWeekStart: moment().startOf('isoWeek'),
                        currentMonthStart: moment().startOf('month'),
                        currentDayStart: moment().startOf('day')
                    }
                case 'day':
                    following = moment(state.currentDayStart)
                    following.add(1, 'day');
                    return {
                        currentDayStart: following,
                        currentWeekStart: moment().startOf('isoWeek'),
                        currentMonthStart: moment().startOf('month'),
                        currentYearStart: moment().startOf('year')
                    }
            }
        });
    }

    isNextDisabled(){
        switch (this.props.rangeType) {
            case 'week':
                return  moment().startOf('isoWeek').isSame(this.state.currentWeekStart);
            case 'month':
                return moment().startOf('month').isSame(this.state.currentMonthStart);
            case 'year':
                return moment().startOf('year').isSame(this.state.currentYearStart);
            case 'day':
                return moment().startOf('day').isSame(this.state.currentDayStart);
        }
    }

    render() {
        return (
            <div style={{ width: '100%', color: '#1272dc', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '20vw' }} onClick={() => this.previous()}>
                    <i className="material-icons">
                        navigate_before
                </i>
                </div>
                <div style={{ position: 'relative', top: '4px' }}>{this.getCurrent()}</div>
                <div style={{ width: '20vw', textAlign: 'right' }} onClick={() => this.next()}>
                    <i className="material-icons" style={{color: this.isNextDisabled()?'rgba(0, 0, 0, 0.26)':''}}>
                        navigate_next
                </i>
                </div>
            </div>
        );
    }
}

export default RangeSelector;