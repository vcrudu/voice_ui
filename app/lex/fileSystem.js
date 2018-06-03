(function () {
    'use strict';
    module.exports = function () {
        var fileSystem;
        function requestTemporaryFileSystem() {
            window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
                fileSystem = fs;
                console.log(fs);
            }, function (error) {
                console.log('file system error: ' + error);
            });
        }

        function createFile(dirEntry, fileName, dataBlob, callback) {
                // Creates a new file or returns the file if it already exists.
                dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
                    writeFile(fileEntry, dataBlob, callback);
                    console.log("fileEntry");
                    console.log(fileEntry);
                }, function (err) {
                    callback(err);
                    console.log("error creating file: " + err);
                });
        }

        function writeFile(fileEntry, dataBlob, callback) {
            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function (fileWriter) {

                fileWriter.onwriteend = function () {
                    console.log("Successful file write...");
                    callback(null, fileEntry.toURL());
                };

                fileWriter.onerror = function (e) {
                    console.log("Failed file write");
                    console.log(JSON.stringify(e));
                };

                fileWriter.write(dataBlob);
            });
        }

        function readFile(url) {
            fileSystem.root.getFile(url, { create: false, exclusive: false }, function (fileEntry) {

                fileEntry.file(function (file) {
                    var reader = new FileReader();
            
                    reader.onloadend = function() {
                        console.log("Read successfully the file");            
                        console.log(this.result);            
                    };
            
                    reader.readAsArrayBuffer(file);
            
                }, function(err){
                    console.log("error reading file: " + JSON.stringify(err));
                });

            }, function (err) {
                console.log("error reading file: " + JSON.stringify(err));
            });
            
        }
        

        function writeToTemporaryFile(dataBlob, callback) {
            createFile(fileSystem.root, 'answer.mp3', dataBlob, callback);
        }

        function getAnswerFile() {
            console.log("fileSystem.root");
            console.log(fileSystem);
            return fileSystem;
        }


        return {
            requestTemporaryFileSystem: requestTemporaryFileSystem,            
            writeToTemporaryFile:writeToTemporaryFile,
            getAnswerFile: getAnswerFile
        };
    };
})();