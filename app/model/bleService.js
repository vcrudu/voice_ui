import apiService from './apiService';
import moment from 'moment';
import parser from 'bleadvertise';
const serviceUuid = 'FFF0';
const characteristicUuid = 'FFF6';
const characteristicUuid2 = 'FFF7';

class BleService {
    takeMeasurement(deviceType, saveMeasure, saveDevice, token, onSuccess) {
        console.log('takeMeasurement started');
        var serviceUuid;
        var characteristicsUuid;
        switch (deviceType) {
            case 'weight':
                serviceUuid = 'FFF0';
                characteristicsUuid = 'FFF4';
                break;
            default:
                serviceUuid = '1810';
                characteristicsUuid = '2A35';

        }
        var once = false;
        if (window.ble) {
            console.log('Starting to scan');
            setTimeout(() => {
                ble.stopScan(() => { console.log('Stop scanning for no activity.'); })
            }, 5 * 60 * 1000);
            ble.startScan([serviceUuid], (device) => {
                console.log(device);
                console.log('Stop scanning');
                ble.stopScan(() => {
                    saveDevice(device);
                    console.log(JSON.stringify(device))
                    ble.connect(device.id, (peripheralData) => {
                        console.log(peripheralData)
                        ble.startNotification(device.id, serviceUuid, characteristicsUuid, (data) => {
                            const intData = new Uint8Array(data);
                            let dateTime = moment({ years: moment().year(), months: (intData[9] - 1), days: intData[10], hours: intData[11], minutes: intData[12], seconds: moment().second() });
                            let dateTime2 = moment(dateTime).add(1, 'seconds');

                            let bloodPressure = { dateTime: dateTime, systolic: intData[1], diastolic: intData[3], deviceModelType: "BloodPressure" };
                            let heartRate = { dateTime: dateTime2, heartRate: intData[14], deviceModelType: "HeartRate" };
                            saveMeasure(bloodPressure);

                            apiService.sendMeasure(token, bloodPressure, (error, data) => {
                                console.log(data);
                            });
                            apiService.sendMeasure(token, heartRate, (error, data) => {
                                console.log(data);
                            });
                            if (!once) {
                                once = true;
                                onSuccess(bloodPressure);
                            }
                        }, (error) => {
                            console.log(error)
                        });
                    }, function (error) {
                        console.log(error)
                    });
                });
            }, (error) => {
                console.log(error)
            });
        }
    }

    startTest() {
        console.log('takeMeasurement started');
        var serviceUuid;
        var characteristicsUuid;
        var deviceType = 'weight';
        switch (deviceType) {
            case 'weight':
                serviceUuid = 'FFF0';
                characteristicsUuid = 'FFF1';
                break;
            default:
                serviceUuid = '1810';
                characteristicsUuid = '2A35';

        }
        var once = false;
        if (window.ble) {
            console.log('Starting to scan');
            setTimeout(() => {
                ble.stopScan([], () => { console.log('Stop scanning for no activity.'); })
            }, 15 * 60 * 1000);
            ble.startScan([], (device) => {
                console.log(JSON.stringify(device))
                if (device.advertising &&
                    device.advertising.kCBAdvDataServiceUUIDs && device.advertising.kCBAdvDataServiceUUIDs.find((uuid) => uuid === serviceUuid)) {//name==="IH-51-1490-BT"){
                    console.log(JSON.stringify(device))
                    ble.stopScan(() => {
                        console.log("Stopped scanning");
                    });
                }
            }, (error) => {
                console.log(error)
            });
        }
    }

    setSBTime(){
        ble.startScan([serviceUuid], (device) => {
            console.log(JSON.stringify(device));
            
              if (device.advertising &&
                device.advertising.kCBAdvDataServiceUUIDs && device.advertising.kCBAdvDataServiceUUIDs.find((uuid) => uuid === serviceUuid)) {//name==="IH-51-1490-BT"){
                ble.stopScan(() => {
                    console.log("Stopped scanning");
                });
 
                ble.connect(device.id, ()=>{
              console.log('successfully connected');
              var data = new Uint8Array(16)
              data[0] = 0x01;
              data[1] = 0x12;
              data[2] = moment().month() + 1;
              data[3] = moment().day();
              data[4] = moment().hour();
              data[5] = moment().minute();
              data[6] = moment().second();
              ble.write(device.id, serviceUuid, characteristicUuid, data.buffer, (data)=>{
                  console.log('successfully sent');
                  ble.disconnect(serviceUuid, ()=>{
                      console.log('successfully disconected');
                  }, ()=>{
                      console.log('failure disconect');
                  });
              }, (error)=>{
                  console.log(error);
                  ble.disconnect(serviceUuid, ()=>{
                      console.log('successfully disconected');
                  }, ()=>{
                      console.log('failure disconect');
                  });
              });  
             },
             (error)=>{
                console.log(error);
             });
            }
        }, (error)=>{
            console.log(error);
        });
    }

    getBP(){
        ble.startScan([serviceUuid], (device) => {
            console.log(JSON.stringify(device));
            
              if (device.advertising &&
                device.advertising.kCBAdvDataServiceUUIDs && device.advertising.kCBAdvDataServiceUUIDs.find((uuid) => uuid === serviceUuid)) {//name==="IH-51-1490-BT"){
                ble.stopScan(() => {
                    console.log("Stopped scanning");
                });
 
                ble.connect(device.id, ()=>{
              console.log('successfully connected');
              var data = new Uint8Array(16)
              data[0] = 0x2C;
             
              ble.read(device.id, serviceUuid, characteristicUuid2, data.buffer, (data)=>{
                  console.log('successfully sent');
                  ble.disconnect(serviceUuid, ()=>{
                      console.log('successfully disconected');
                  }, ()=>{
                      console.log('failure disconect');
                  });
              }, (error)=>{
                  console.log(error);
                  ble.disconnect(serviceUuid, ()=>{
                      console.log('successfully disconected');
                  }, ()=>{
                      console.log('failure disconect');
                  });
              });  
             },
             (error)=>{
                console.log(error);
             });
            }
        }, (error)=>{
            console.log(error);
        });
    }

    setSBTime1(){
        bluetoothle.initialize(()=>{
            var data = new Uint8Array(16)
            data[0] = 0x01;
            data[1] = moment().year();
            data[2] = moment().month() + 1;
            data[3] = moment().day();
            data[4] = moment().hour();
            data[5] = moment().minute();
            data[6] = moment().second();
            bluetoothle.write(()=>{
                console.log("success");
            }, (error)=>{
                console.log(error);
            }, {
                address:"64885318-BBD0-7B04-1AE8-7E9DBF05B044",
                service:serviceUuid,
                characteristic: characteristicUuid,
                value: bluetoothle.bytesToEncodedString(data.buffer)
            });
        }, {
            "request": true,
            "statusReceiver": false,
            "restoreKey" : "bluetoothleplugin"
          });
        
    }
}

const bleService = new BleService();

export default bleService;