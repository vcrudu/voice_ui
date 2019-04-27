import React from 'react';
import GuestSymptomate from './guestSymptomate';
import LeafHeader from '../shared/leafHeader';

class GuestSymptomateWithHeader extends React.Component{
    constructor(props){
        super(props);
    }

        render() {
        return (<div>
            <LeafHeader backUrl='/stage/home/false'
                    title='You symptoms' />
            <GuestSymptomate/>
            </div>);
   
    }
}

export default GuestSymptomateWithHeader;