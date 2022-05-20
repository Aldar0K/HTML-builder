const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const pathToText = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(pathToText);

stdout.write('Пожалуйста, введите ваш текст\n');

stdin.on('data', chunk => {
    if (chunk.toString().trim() === 'exit' || chunk.toString().trim() === '.exit') {
        process.exit();
    }
    output.write(chunk);
});

process.on('exit', () => {
    stdout.write('Завершение работы');
});