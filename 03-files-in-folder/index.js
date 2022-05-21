const path = require('path');
const fs = require('fs');

const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder, (err, files) => {
  if (err) throw err;
  
  for (let i = 0; i < files.length; i++) {
    fs.stat(path.join(pathToFolder, files[i]), (err, stats) => {
      if (err) throw err;

      if (stats.isFile()) {
        let fileName = files[i].split('.')[0];
        let extName = path.extname(files[i]).slice(1);
        let fileSize = (stats.size / 1024).toFixed(3) + 'kb';

        console.log(fileName, '-', extName, '-', fileSize);
      };
    });
  };
});
