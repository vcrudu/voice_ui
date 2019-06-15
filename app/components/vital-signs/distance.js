import React, {Component} from 'react'
import RangeTypeSelector from './shared/rangeTypeSelector'
import RangeSelector from './shared/rangeSelector'
import LeafHeader from '../shared/leafHeader'
import moment from 'moment'

class Distance extends Component{
    constructor(props){
        super(props);
        this.onRangeTypeChange = this.onRangeTypeChange.bind(this);
        this.state = {
            rangeType: 'day'
        };
    }

    onRangeTypeChange(rangeType){
        this.setState({
            rangeType:rangeType
        });
    }

    render() {
            return (
                <div>
                    <LeafHeader backUrl='/stage/signs' title='Blood pressure' />
                    <div className="signs-content">
                        <RangeTypeSelector onChange={this.onRangeTypeChange}/>
                        <RangeSelector rangeType={this.state.rangeType} />
                    </div>
                </div>
            );
    }
}

export default Distance;