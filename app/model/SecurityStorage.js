class SecurityStorage {
    init(callback){
        if(window.cordova){
            window.securityStorage = new cordova.plugins.SecureStorage(
                function () { console.log('Success'); callback(null); },
                function (error) { console.log('Error ' + error); callback(error) },
                'bp.member');
            }
    }

    setValue(key, value) {
        if(window.cordova){
            if(!window.securityStorage){
                this.init((error)=>{
                    if(error) {return window.localStorage.setItem(key, value);}
                    window.securityStorage.set(
                        function (key) { console.log('Set ' + key); },
                        function (error) { console.log('Error ' + error); },
                        key, value);
                });
            } else {
                window.securityStorage.set(
                    function (key) { console.log('Set ' + key); },
                    function (error) { console.log('Error ' + error); },
                    key, value);
            }
        } else {
            window.localStorage.setItem(key, value)
        }
    }

    getValue(key, callback) {
        if(window.cordova){
            if(!window.securityStorage) {
                setTimeout(()=>{
                    callback(null,window.localStorage.getItem(key));
                },0);
                return;
            }
            window.securityStorage.get(
                function (value) { callback(null, value); console.log('Value ' + error); },
                function (error) { callback(error, null); console.log('Error ' + error); },
                key);
        } else {
            setTimeout(()=>{
                callback(null,window.localStorage.getItem(key));
            },0);
        }
    }

    removeValue(key) {
        if(window.cordova){
            if(!window.securityStorage) return;
            window.securityStorage.remove(
                function (key) { console.log('Removed ' + key); },
                function (error) { console.log('Error, ' + error); },
                key);
        } else {
            window.localStorage.removeItem(key);
        }
    }
}

export default SecurityStorage;