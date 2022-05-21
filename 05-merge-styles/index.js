const path = require('path');
const fs = require('fs');
const { stdin, stdout } = require('process');

const pathToInputFolder = path.join(__dirname, 'styles');
const pathToOutputFolder = path.join(__dirname, 'project-dist');

const output = fs.createWriteStream(path.join(pathToOutputFolder, 'bundle.css'))