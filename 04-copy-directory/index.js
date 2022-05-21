const path = require('path');
const fs = require('fs');

const pathToInputFolder = path.join(__dirname, 'files');
const pathToOutputFolder = path.join(__dirname, 'files-copy');

fs.mkdir(pathToOutputFolder, { recursive: true }, (err) => {
    if (err) throw err;
    console.log('Directory created successfully!');
});

fs.readdir(pathToInputFolder, (err, files) => {
    if (err) throw err;
    
    for (let i = 0; i < files.length; i++) {
        fs.copyFile(path.join(pathToInputFolder, files[i]), path.join(pathToOutputFolder, files[i]), (err) => {
            if (err) console.log("Error Found:", err);
            console.log('File copied successfully!');
        });
    }
});