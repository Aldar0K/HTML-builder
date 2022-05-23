const path = require('path');
const fs = require('fs');

const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder, (err, files) => {
  if (err) throw err;
  
  for (let i = 0; i < files.length; i++) {
    fs.stat(path.join(pathToFolder, files[i]), (err, stats) => {
      if (err) throw err;

      if (stats.isFile()) {
        const fileExt = path.extname(files[i]);
        const fileName = path.basename(files[i], fileExt);
        const fileSize = (stats.size / 1024).toFixed(3) + 'kb';

        console.log(fileName, '-', fileExt.slice(1), '-', fileSize);
      };
    });
  };
});
