import 'material-components-web/material-components-web.scss';
import './fonts/material-icons.scss';
import './styles/main.scss';
import React from 'react';
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import bloodPressureAssistant from './reducers'
import dataStorage from './model/DataStorage';
import apiService from './model/apiService';
import APP_SETTINGS from './constants/appSettings';
import io from 'socket.io-client';
import Speaker from './polly/speaker';
import messages from './messages';
import SecurityStorage from './model/SecurityStorage';
import {setCurrentAction, registerNotification} from './actions'
import healthKitService from './model/healthKitService';
//dataStorage.deleteState();

if (!Object.entries) {
    Object.entries = function( obj ){
      var ownProps = Object.keys( obj ),
          i = ownProps.length,
          resArray = new Array(i); // preallocate the Array
      while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
      
      return resArray;
    };
  }

window.store = createStore(bloodPressureAssistant, dataStorage.loadState());
store.subscribe(()=>{
    dataStorage.saveState(store.getState());
});

import {
    HashRouter as Router
  } from 'react-router-dom';
import Routes from './routes';



function InitPush() {
    if (window.PushNotification) {
        window.notifications = [];
        PushNotification.hasPermission(data => {
            if (data.isEnabled) {
                console.log('isEnabled');
            }
        });
        var push = PushNotification.init({
            android: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        });
        push.on('registration', function (data) {
            console.log(JSON.stringify(data));
            store.dispatch(registerNotification(data.registrationId));
            let state = store.getState();
            if (state.userData && state.userData.token) {
                apiService.updatePushNotification(
                    data.registrationId,
                    state.userData.token,
                    (result) => {
                        if (!result.success) console.log(result.error)
                    }
                );
            }
        });
        push.on('notification', function (data) {
            store.dispatch(setCurrentAction({
                pictureId: data.additionalData.picture_id,
                scenarioId: data.additionalData.scenario_id,
                dateTime: data.additionalData.date_time,
                scenarioTitle: data.additionalData.scenario_title,
                message: data.message,
                timeToLive: data.additionalData.time_to_live
            })); 
        });
        push.on('error', function (err) {
            console.log(err)
            //alert('Event=error, message=' + err.message)
        });
    }
}

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("resume", this.onResume.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        if(window.cordova){
            window.sampleRate = audioinput.SAMPLERATE.VOIP_16000Hz;
            window.Keyboard.shrinkView(true);
            window.Keyboard.disableScrollingInShrinkView(true);
        }

        if (!window.socket) {
            window.socket = io(APP_SETTINGS.serverUrl);
            let state = store.getState();
             window.socket.on('connect', function () {
                window.socket.emit('authenticate', { token: state.userData.token });
                window.socket.on('disconnect', function (reason) {
                    console.log('socket disconnect:' + reason)
                });
                window.socket.on('card', function (event) {
                    store.dispatch(setCurrentAction({
                        pictureId: event.pictureId,
                        scenarioId: event.scenarioId,
                        dateTime: event.dateTime,
                        scenarioTitle: event.scenarioTitle,
                        message: event.message,
                        timeToLive: event.timeToLive
                    })); 
                    console.log('socket event:' + event)
                });
            }); 
        }

        InitPush();

        healthKitService.initHealthRepository((data)=>{
            
        });
       
        ReactDOM.render(
            (
                <Provider store={store}>
                    <Router>
                        <Routes/>
                    </Router>
                </Provider>
            ),
            document.getElementById('root')
          );
    },

    onResume: function(){
        setTimeout(function() {
            
        }, 0);
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {

    }
};

app.initialize();

if(!window.cordova){
    app.onDeviceReady();
}

