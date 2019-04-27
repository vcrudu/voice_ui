import React, { Component } from 'react';
import { ThemeProvider } from '@rmwc/theme';
import moment from 'moment';

import { Typography } from '@rmwc/Typography';
import {
    Card,
    CardPrimaryAction,
    CardAction
} from '@rmwc/Card';

class Average extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ThemeProvider options={{
                primary: this.props.color,
                secondary: 'white'
            }}>
                <Card theme='primaryBg' style={{ width: '95vw', marginTop: '5px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <CardPrimaryAction onClick={()=>this.props.onClick()}>
                        <div style={{ padding: '0rem 0rem 0rem 1rem' }}>
                            <Typography use="subtitle2" style={{ display:'inline-block', fontWeight: 'bold', width: this.props.summaryId=='medication_history'?'80vw':'44vw' }} theme="secondary">{this.props.title}</Typography>
                            {
                            this.props.summaryId!='medication_history'?
                            (<div style={{display:'inline-block', marginLeft:'1vw', position:'relative',left:'2vw', bottom:'1vh'}}>
                            <div style={{width:'40vw', display:'flex', justifyContent:'flex-end'}}>
                                <Typography use="caption" style={{ textAlign:'end'}} theme="secondary">{this.props.description}</Typography>
                            </div>
                            </div>):null
                            }
                            <Typography tag='div' use={this.props.isNarative?"body1":"headline6"} theme="secondary" tag='span'>{this.props.value}</Typography>
                            <Typography use="body1" style={{marginLeft: '1vw'}} theme="secondary">{this.props.unit}</Typography>
                            <div></div>
                            <Typography use="caption" style={{ position: 'relative', left: '2vh', marginLeft: '60vw' }} theme="secondary">{this.props.dateTime}</Typography>
                        </div>
                    </CardPrimaryAction>
                </Card>
            </ThemeProvider>
        );
    }
}

export default Average;