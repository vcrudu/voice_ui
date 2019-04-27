import React from 'react';
import lexImage from '../../assets/images/lex.png';
import Button from '@rmwc/Button'
import DemoConversation from '../../demoConversation';
import { Grid, GridCell } from '@rmwc/Grid';

const AudioRenderer = () => {
    const demoConversation = new DemoConversation();
    return(<div className="audio-control">
            <p id="audio-control" className="white-circle">
                <img src={lexImage} style={{marginLeft:'40vw', marginTop:'35vw'}} />
                <canvas className="visualizer"></canvas>
            </p>
            <p style={{marginLeft:'40vw'}}><span id="message"></span></p>
            <Grid>
                <GridCell phone="2">
                    <Button style={{ width: '100%' }} onClick={()=>{demoConversation.transcribeAudio()}}>Conversation</Button>
                </GridCell>
                <GridCell phone="2">
                    <Button style={{ width: '100%' }} onClick={()=>{demoConversation.startSpeech()}}>Start speech</Button>
                </GridCell>
            </Grid>
        </div>);
}

export default AudioRenderer;