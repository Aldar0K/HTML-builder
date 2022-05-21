const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');

const rl = readline.createInterface({ input, output });

const pathToText = path.join(__dirname, 'text.txt');

const stream = fs.createWriteStream(pathToText);

const question = () => (rl.question('Please, enter your message\n', (answer) => {
    if (answer === 'exit' || answer === '.exit') {
        rl.close();
    } else {
        stream.write(`${answer}\n`);
        question();
    }
}))
question();

rl.on('close',() => {
    console.log('Thank you for your messages, bye!');
    process.exit();
})