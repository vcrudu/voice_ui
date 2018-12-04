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
//dataStorage.deleteState();

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
            alert('Event=error, message=' + err.message)
        });
    }
}

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        if(window.cordova){
            window.sampleRate = audioinput.SAMPLERATE.VOIP_16000Hz;
            Keyboard.shrinkView(true);
            Keyboard.disableScrollingInShrinkView(true);
        }

        InitPush();
       
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

    // Update DOM on a Received Event
    receivedEvent: function (id) {

    }
};

app.initialize();

if(!window.cordova){
    app.onDeviceReady();
}

