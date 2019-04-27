import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import moment from 'moment';
import {
    List,
    ListItem,
    ListItemGraphic,
    ListItemPrimaryText,
    ListItemText,
    ListDivider,
    ListItemSecondaryText,
    SimpleListItem
  } from '@rmwc/list';

  import chatApiService from '../../model/chatApiService';
  
class ChatList extends React.Component {
    constructor(props){
        super(props);
        this.state = {chatsList:[]};
    }

    componentDidMount(){
        this.props.actions.changeScreenTitle('History');
        chatApiService.getChatsList(this.props.userData.token, (err, chatsList)=>{
            if(!err)
            this.setState({chatsList:chatsList});
        });
    }

    render() {
        return (<div>
            <List style={{ height: '75vh', overflowY: 'scroll' }} twoLine>
                {this.state.chatsList ?
                    this.state.chatsList.map((chat) => {
                        return (
                            <div key={chat.dateTime}>
                                <Link to={`/chat/chatList/${chat.scenarioId}/${chat.dateTime}/${chat.scenarioTitle}`}>
                                    <SimpleListItem graphic="chat" text={chat.scenarioTitle} secondaryText={moment(new Date(chat.dateTime)).format('lll')} meta="info" />
                                </Link>
                                <ListDivider />
                            </div>);
                    }) : null
                }
            </List>
        </div>
        );
    }
}

const mapStateToProps = state => {
    return { ...state};
}

const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(Actions, dispatch)
    };
  };

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatList));