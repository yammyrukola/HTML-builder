const path = require('path');
const fs = require('fs');
const { exit } = require('process');
const { stdout, stdin } = process;

const fileName = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(fileName);
process.on('exit', () => {
  stdout.write('Goodbye!\n');
});
process.on('SIGINT', () => {
  stdout.write('\n');
  exit(0);
});

stdout.write('\nHello! Please enter some text:\n');
stdin.on('data', (data) => {
  if (data.toString().toLocaleLowerCase().trim() === 'exit') {
    exit(0);
  }
  writeStream.write(data);
});
