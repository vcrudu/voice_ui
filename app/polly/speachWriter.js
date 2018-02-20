class SpeachWriter {
    constructor(){
    }

    requestTemporaryFileSystem(callback) {
        if(this._fileSystem){
            callback();
        }
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024,  (fs) => {
            this._fileSystem = fs;
            callback();
        }, function (error) {
            callback(error);
        });
    }

    createFile(dirEntry, fileName, dataBlob, callback) {
        // Creates a new file or returns the file if it already exists.
        dirEntry.getFile(fileName, { create: true, exclusive: false }, (fileEntry)=>{

            this.writeFile(fileEntry, dataBlob, callback);
            console.log("fileEntry");
            console.log(fileEntry);

        },  (err)=>{
            callback(err);
            console.log("error creating file: " + err);
        });
    }

    writeFile(fileEntry, dataBlob, callback) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter( (fileWriter) => {

            fileWriter.onwriteend =  ()=>{
                console.log("Successful file write...");
                callback(null, fileEntry.toURL());
            };

            fileWriter.onerror = (e) => {
                console.log("Failed file write");
                console.log(JSON.stringify(e));
            };

            fileWriter.write(dataBlob);
        });
    }

    readFile(url) {
        this.fileSystem.root.getFile(url, { create: false, exclusive: false }, (fileEntry) => {

            fileEntry.file( (file) => {
                var reader = new FileReader();

                reader.onloadend = function () {
                    console.log("Read successfully the file");
                    console.log(this.result);
                };

                reader.readAsArrayBuffer(file);

            }, (err) => {
                console.log("error reading file: " + JSON.stringify(err));
            });

        }, (err) => {
            console.log("error reading file: " + JSON.stringify(err));
        });

    }

    writeToTemporaryFile(dataBlob, callback) {
        if(!this._fileSystem) throw "File system is not initialized"
        this.createFile(this._fileSystem.root, 'speach.mp3', dataBlob, callback);
    }
}

export default SpeachWriter;