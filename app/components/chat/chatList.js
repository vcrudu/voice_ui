import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import {
    List,
    ListItem,
    ListItemGraphic,
    ListItemMeta,
    ListDivider
  } from 'rmwc/list';
  
class ChatList extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.actions.changeScreenTitle('Chats');
    }

    render() {
        return (<List>
            <List>
                <ListItem>
                    <Link to='/chat'>
                        <ListItemGraphic icon="star_border" />
                        Main chat
                    </Link>
                </ListItem>
                <ListDivider/>
            </List>
        </List>);
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