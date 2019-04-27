import React, {Component} from 'react'
import RangeTypeSelector from './shared/rangeTypeSelector'
import RangeSelector from './shared/rangeSelector'
import LeafHeader from '../shared/leafHeader'
import moment from 'moment'

class Distance extends Component{
    constructor(props){
        super(props);
        this.state = {
            weekStart: moment().startOf('isoWeek')
        };
    }

    previousWeek() {
        this.setState((prev) => {
            return {
                weekStart: moment(prev.weekStart).subtract(7, 'day')
            }
        })
    }

    nextWeek(){
        this.setState((prev) => {
            return {
                weekStart: moment(prev.weekStart).add(7, 'days')
            }
        })
    }

    render() {
            return (
                <div>
                    <LeafHeader backUrl='/stage/signs' title='Blood pressure' />
                    <div className="signs-content">
                        <RangeTypeSelector/>
                        <RangeSelector weekStart={this.state.weekStart}
                                       previousWeek = {()=>this.previousWeek()}
                                       nextWeek={()=>this.nextWeek()}
                        />
                    </div>
                </div>
            );
    }
}

export default Distance;