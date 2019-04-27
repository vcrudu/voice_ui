import React, { Component } from 'react';
import '@material/theme/dist/mdc.theme.css';
import '../../../mobiscroll.custom/css/mobiscroll.react.min.css';
import mobiscroll from '../../../mobiscroll.custom/js/mobiscroll.react.min';
import './style.scss';

class RangeTypeSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {enabledButton:'D'};
        this.getEnabledTheme = this.getEnabledTheme.bind(this);
        this.clickButton = this.clickButton.bind(this);
        this.state = {
            items: [{
                value: 1,
                text: 'Atlanta'
            }, {
                value: 2,
                text: 'Berlin'
            }, {
                value: 3,
                text: 'Boston'
            }, {
                value: 4,
                text: 'Chicago'
            }, {
                value: 5,
                text: 'London'
            }, {
                value: 6,
                text: 'Los Angeles'
            }, {
                value: 7,
                text: 'New York'
            }, {
                value: 8,
                text: 'Paris'
            }, {
                value: 9,
                text: 'San Francisco'
            }],
            val: 1
        };
        
        this.show = this.show.bind(this);
    }
    
     show () {
         this.refs.external.instance.show();
     }

    getEnabledTheme(button) {
        return button === this.state.enabledButton ?
            ['primaryBg', 'onPrimary'] : ['primary']
    }

    clickButton(button) {
        this.setState({ enabledButton: button });
        if (this.props.onClick)
            this.props.onClick(button);
    }

    render() {
        return (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                 <mobiscroll.Form theme="ios">
                 
                <mobiscroll.FormGroup>
                    <mobiscroll.Segmented name="range" value="day" defaultChecked>
                        Day
                    </mobiscroll.Segmented>
                    <mobiscroll.Segmented name="range" value="week">
                        Week
                    </mobiscroll.Segmented>
                    <mobiscroll.Segmented name="range" value="range" value="month">
                        Month
                    </mobiscroll.Segmented>
                    <mobiscroll.Segmented name="range" value="year">
                        Year
                    </mobiscroll.Segmented>
                </mobiscroll.FormGroup>
                </mobiscroll.Form>
            </div>);
    }
};

export default RangeTypeSelector;