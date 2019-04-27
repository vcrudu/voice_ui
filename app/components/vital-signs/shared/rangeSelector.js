import React from 'react';
import moment from 'moment';

const RangeSelector = (props) => {

    return (

        <div style={{width:'100%', color: '#1272dc', display:'flex', justifyContent: 'center'}}>
            <div style={{width:'29vw'}} onClick={()=>props.previousWeek()}>
                <i className="material-icons">
                    navigate_before
                </i>
            </div>
            <div style={{position: 'relative', top:'4px'}}>{`${props.weekStart.format('DD MMM')} - ${moment(props.weekStart).add(6, 'days').format('DD MMM YYYY')}`}</div>
            <div style={{ width:'29vw', textAlign:'right'}} onClick={()=>props.nextWeek()}>
                <i className="material-icons">
                    navigate_next
                </i>
            </div>
        </div>
    );
};

export default RangeSelector;