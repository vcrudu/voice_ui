import React, { Component } from 'react';
import '@material/theme/dist/mdc.theme.css';
import '../../../mobiscroll.custom/css/mobiscroll.react.min.css';
import mobiscroll from '../../../mobiscroll.custom/js/mobiscroll.react.min';
import './style.scss';

class RangeTypeSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {enabledButton:'D'};
        this.rangeTypeChanged = this.rangeTypeChanged.bind(this);
        this.state = {
        };
        
        this.show = this.show.bind(this);
    }
    
     show () {
         this.refs.external.instance.show();
     }

    rangeTypeChanged(event) {
       if(this.props.onChange)this.props.onChange(event.target.value);
    }

    render() {
        return (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                 <mobiscroll.Form theme="ios">
                 
                <mobiscroll.FormGroup>
                    <mobiscroll.Segmented name="range" value="day" onChange={this.rangeTypeChanged} defaultChecked>
                        Day
                    </mobiscroll.Segmented>
                    <mobiscroll.Segmented name="range" value="week" onChange={this.rangeTypeChanged}>
                        Week
                    </mobiscroll.Segmented>
                    <mobiscroll.Segmented name="range" value="month" onChange={this.rangeTypeChanged}>
                        Month
                    </mobiscroll.Segmented>
                    <mobiscroll.Segmented name="range" value="year" onChange={this.rangeTypeChanged}>
                        Year
                    </mobiscroll.Segmented>
                </mobiscroll.FormGroup>
                </mobiscroll.Form>
            </div>);
    }
};

export default RangeTypeSelector;