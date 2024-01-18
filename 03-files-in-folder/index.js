const path = require('path');
const { readdir, stat } = require('fs/promises');

const dir = path.join(__dirname, 'secret-folder');

const formatOutput = (file, fileStat) => {
  const fileExtension = path.extname(file).slice(1);
  const fileName = path.basename(file, `.${fileExtension}`);
  const fileSize = (fileStat.size / 1024).toFixed(3);
  return `${fileName} - ${fileExtension} - ${fileSize}kb`;
};

readdir(dir)
  .then((items) => {
    for (const item of items) {
      stat(path.join(dir, item)).then((itemStat) => {
        if (itemStat.isFile()) {
          console.log(formatOutput(item, itemStat));
        }
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
