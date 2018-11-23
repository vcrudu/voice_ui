import apiService from './apiService';
import moment from 'moment';

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
                ble.startScan([], () => { console.log('Stop scanning for no activity.'); })
            }, 15 * 60 * 1000);
            ble.startScan([], (device) => {
                console.log(device);
                if (device.advertising &&
                    device.advertising.kCBAdvDataServiceUUIDs && device.advertising.kCBAdvDataServiceUUIDs.find((uuid) => uuid === serviceUuid)) {//name==="IH-51-1490-BT"){
                    console.log('Stop scanning');
                    ble.stopScan(() => {
                        saveDevice(device);
                        console.log(JSON.stringify(device))
                        ble.connect(device.id, (peripheralData) => {
                            console.log(peripheralData)
                            ble.startNotification(device.id, serviceUuid, characteristicsUuid, (data) => {
                                const intData = new Uint8Array(data);
                                let dateTime = moment({ years: moment().year(), months: (intData[9]-1), days: intData[10], hours: intData[11], minutes: intData[12], seconds: moment().second() });
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
                }
            }, (error) => {
                console.log(error)
            });
        }
    }
}

const bleService = new BleService();

export default bleService;