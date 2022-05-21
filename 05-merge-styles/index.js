const path = require('path');
const fs = require('fs');

const pathToInputFolder = path.join(__dirname, 'styles');
const pathToOutputFolder = path.join(__dirname, 'project-dist');

const output = fs.createWriteStream(path.join(pathToOutputFolder, 'bundle.css'));

console.log('bundle.css created successfully');

fs.readdir(pathToInputFolder, (err, files) => {
    if (err) throw err;
    
    for (let i = 0; i < files.length; i++) {
        if (files[i].split('.')[1] === 'css') {
            const input = fs.createReadStream(path.join(pathToInputFolder, files[i]));

            let data = '';

            input.on('data', chunk => data += chunk);

            input.on('end', () => output.write(data));

            input.on('error', error => console.log('Error', error.message));

            console.log('css file implemented successfully')
        };
    };
});