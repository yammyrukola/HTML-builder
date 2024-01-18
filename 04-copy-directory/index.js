const path = require('path');
const { mkdir, readdir, unlink, copyFile } = require('fs').promises;

const dirSource = path.join(__dirname, 'files');
const dirDestination = path.join(__dirname, 'files-copy');
const message = `The contents of directory 'files' were successfully copied to directory 'files-copy'`;

console.time(message);
mkdir(dirDestination, { recursive: true })
  .then(async () => {
    // delete all files in dirDestination
    const filesDestination = await readdir(dirDestination);
    const filesUnlinkPromises = filesDestination.map((file) => {
      const filePath = path.join(dirDestination, file);
      return unlink(filePath);
    });
    await Promise.all(filesUnlinkPromises);

    // copy all files from dirSource to dirDestination
    const filesSource = await readdir(dirSource);
    const filesCopyPromises = filesSource.map((file) => {
      const filePathSource = path.join(dirSource, file);
      const filePathDestination = path.join(dirDestination, file);
      return copyFile(filePathSource, filePathDestination);
    });
    await Promise.all(filesCopyPromises);

    console.timeEnd(message);
  })
  .catch((err) => {
    console.log(err.message);
  });
