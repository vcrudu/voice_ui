/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
import {setCurrentAction} from './actions'
//dataStorage.deleteState();

window.store = createStore(bloodPressureAssistant, dataStorage.loadState());
store.subscribe(()=>{
    dataStorage.saveState(store.getState());
});

import {
    HashRouter as Router
  } from 'react-router-dom';
import Routes from './routes';

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

            window.FirebasePlugin.grantPermission();

            window.FirebasePlugin.getToken(function(token) {
                // save this server-side and use it to push notifications to this device
                console.log(token);
            }, function(error) {
                console.error(error);
            });

            window.FirebasePlugin.onNotificationOpen(function(notification) {
                console.log(notification);
            }, function(error) {
                console.error(error);
            });
        }

        window.socket = io(APP_SETTINGS.enrolServerUrl);

        window.socket.on('connect', function (socket) {
            window.socket.emit("provideUserId", {userId:"vcrudu@hotmail.com", mobile:"07532302702"}, function(data){
                console.log(data);
            });
        });

        window.socket.on('sendPlan', function (data) {
            console.log(data);
            if (window.cordova) {
                cordova.plugins.notification.local.clearAll();
                switch (data.currentIntent.name) {
                    case "EnrolPatient":
                        setTimeout(() => {
                            if (window.cordova) {
                                const EnrolePatient = messages["EnrolPatient"];
                                cordova.plugins.notification.local.schedule({
                                    id: 1,
                                    title: EnrolePatient.title,
                                    text: EnrolePatient.subtitle,
                                    foreground: true,
                                    data: {
                                        "intent-name": "EnrolPatient"
                                    }
                                });
                                const MeasureBP = messages["MeasureBP"];
                                cordova.plugins.notification.local.schedule({
                                    id: 2,
                                    title: MeasureBP.title,
                                    text: MeasureBP.subtitle,
                                    trigger: { type: "timespan", in: 30, unit: 'second' },
                                    foreground: true,
                                    data: {
                                        "intent-name": "MeasureBP"
                                    }
                                });
                                cordova.plugins.notification.local.on('trigger', (event) => {
                                    const message = messages[event.data["intent-name"]];
                                    store.dispatch(setCurrentAction(message));
                                    let speaker = new Speaker();
                                    speaker.speak(message.notificationText);
                                }, this);
                            } else {
                                const message = messages[data.currentIntent.name];
                                store.dispatch(setCurrentAction(message));
                            }
                        }, 10000);
                        break;
                    case "EnrolPatientForTreatment":
                        setTimeout(() => {
                            if (window.cordova) {
                                const currentAction = messages["EnrolPatientForTreatment"];
                                cordova.plugins.notification.local.schedule({
                                    id: 3,
                                    title: currentAction.title,
                                    text: currentAction.subtitle,
                                    foreground: true,
                                    data: {
                                        "intent-name": currentAction.id
                                    }
                                });
                                const TakeDrug = messages["TakeDrug"];
                                cordova.plugins.notification.local.schedule({
                                    id: 4,
                                    title: TakeDrug.title,
                                    text: TakeDrug.subtitle,
                                    trigger: { type: "timespan", in: 30, unit: 'second' },
                                    foreground: true,
                                    data: {
                                        "intent-name": "TakeDrug"
                                    }
                                });
                                cordova.plugins.notification.local.on('trigger', (event) => {
                                    const message = messages[event.data["intent-name"]];
                                    store.dispatch(setCurrentAction(message));
                                    let speaker = new Speaker();
                                    speaker.speak(message.notificationText);
                                }, this);
                            } else {
                                const message = messages[data.currentIntent.name];
                                store.dispatch(setCurrentAction(message));
                            }
                        }, 10000);
                        break;
                    default:
                        break;
                }
            }
        });

        window.socket.on('disconnect', function () {

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

    // Update DOM on a Received Event
    receivedEvent: function (id) {

    }
};

app.initialize();

if(!window.cordova){
    app.onDeviceReady();
}

