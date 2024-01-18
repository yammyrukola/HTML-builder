const path = require('path');
const fs = require('fs');
const stdout = process.stdout;

const fileName = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(fileName);
readStream.on('data', (chunk) => stdout.write(chunk));
