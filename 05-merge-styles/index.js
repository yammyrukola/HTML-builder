const path = require('path');
const { readFile, writeFile, readdir } = require('fs').promises;

const source = path.join(__dirname, 'styles');
const destination = path.join(__dirname, 'project-dist', 'bundle.css');
readdir(source, { withFileTypes: true }).then(async (files) => {
  const filePromises = files
    .filter((file) => path.extname(file.name) === '.css' && file.isFile())
    .map((file) => {
      const filePath = path.join(source, file.name);
      return readFile(filePath, 'utf8');
    });
  const bundle = (await Promise.all(filePromises)).join('\n');
  await writeFile(destination, bundle);
  console.log('Bundle was successfully created!');
});
