const path = require('path');
const { mkdir, readFile, writeFile, readdir, rm, copyFile } =
  require('fs').promises;
const START_TAG = '{{';
const END_TAG = '}}';
const assetsSource = path.join(__dirname, 'assets');
const assetsDestination = path.join(__dirname, 'project-dist', 'assets');

async function copyAssets(source, destination) {
  await rm(destination, { recursive: true, force: true });
  await copyDir(source, destination);
}

async function copyDir(source, destination) {
  mkdir(destination, { recursive: true });

  // copy all files from dirSource to dirDestination
  const itemsSource = await readdir(source, { withFileTypes: true });
  const filesCopyPromises = itemsSource.map((item) => {
    const itemPathSource = path.join(source, item.name);
    const itemPathDestination = path.join(destination, item.name);
    if (item.isDirectory()) {
      // isDirectory
      return copyDir(itemPathSource, itemPathDestination);
    }
    // isFile
    return copyFile(itemPathSource, itemPathDestination);
  });
  await Promise.all(filesCopyPromises);
}

async function makeBundle() {
  const source = path.join(__dirname, 'styles');
  const destination = path.join(__dirname, 'project-dist', 'style.css');
  readdir(source, { withFileTypes: true }).then(async (files) => {
    const filePromises = files
      .filter((file) => path.extname(file.name) === '.css' && file.isFile())
      .map((file) => {
        const filePath = path.join(source, file.name);
        return readFile(filePath, 'utf8');
      });
    const bundle = (await Promise.all(filePromises)).join('\n');
    await writeFile(destination, bundle);
  });
}

async function getComponent(componentName) {
  const componentFile = path.join(
    __dirname,
    'components',
    `${componentName}.html`,
  );
  const component = await readFile(componentFile, 'utf8');

  return component;
}

async function processTemplate(template) {
  let html = template;
  let current = 0;
  let pos = template.indexOf(START_TAG, current);
  while (pos !== -1) {
    const posEnd = template.indexOf(END_TAG, pos);
    const templateTag = template.slice(pos + START_TAG.length, posEnd);
    const component = await getComponent(templateTag);
    html = html.replaceAll(`${START_TAG}${templateTag}${END_TAG}`, component);

    current = pos + 1;
    pos = template.indexOf(START_TAG, current);
  }

  return html;
}

const destination = path.join(__dirname, 'project-dist');
console.time('Time');

mkdir(destination, { recursive: true })
  .then(async () => {
    const template = await readFile(
      path.join(__dirname, 'template.html'),
      'utf8',
    );
    const html = await processTemplate(template);
    await writeFile(path.join(destination, 'index.html'), html, 'utf8');

    console.log('Template was successfully processed!');
    console.log(
      `Size: ${(template.length / 1024).toFixed(3)}kb ==> ${(
        html.length / 1024
      ).toFixed(3)}kb`,
    );
    console.timeEnd('Time');
    makeBundle().then(console.log('Bundle was successfully created!'));
    copyAssets(assetsSource, assetsDestination).then(
      console.log('Assets was successfully copied!'),
    );
  })
  .catch((err) => console.log(err.message));
