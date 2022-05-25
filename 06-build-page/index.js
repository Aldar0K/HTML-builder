const path = require('path');
const fs = require('fs');

// Пути.
const pathToTemplateHTML = path.join(__dirname, 'template.html');
const pathToAssetsSrc = path.join(__dirname, 'assets');
const pathToStylesSrc = path.join(__dirname, 'styles');
const pathToComponents = path.join(__dirname, 'components');

const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToAssetsDist = path.join(pathToProjectDist, 'assets');
const pathToIndexHTMLDist = path.join(pathToProjectDist, 'index.html');
const pathToStylesCSSDist = path.join(pathToProjectDist, 'style.css');

// Функция для создания папок.
function makeFolder(path) {
    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) throw err;

        console.log(`Folder created successfully!`);
    });
}

// Создание папки project-dist.
makeFolder(pathToProjectDist);


// Копирование папки assets в project-dist.
makeFolder(pathToAssetsDist);

function copyFolder(pathToSrc, pathToDist) {
    fs.readdir(pathToSrc, (err, files) => {
        if (err) throw err;

        for (let i = 0; i < files.length; i++) {
            fs.stat(path.join(pathToSrc, files[i]), (err, stats) => {
                if (err) throw err;

                if (stats.isDirectory()) {
                    makeFolder(path.join(pathToDist, files[i]));
                    copyFolder(path.join(pathToSrc, files[i]), path.join(pathToDist, files[i]));
                } else {
                    fs.copyFile(path.join(pathToSrc, files[i]), path.join(pathToDist, files[i]), (err) => {
                        if (err) throw err;
                    });
                }
            });
        }
    });
}
copyFolder(pathToAssetsSrc, pathToAssetsDist);


// Объединение файлов стилей из папки styles в style.css в папке project-dist.
const streamToStylesCSSDist = fs.createWriteStream(pathToStylesCSSDist);

fs.readdir(pathToStylesSrc, (err, files) => {
    if (err) throw err;
    
    for (let i = 0; i < files.length; i++) {
        if (path.extname(files[i]).slice(1) === 'css') {
            const input = fs.createReadStream(path.join(pathToStylesSrc, files[i]));
            let data = '';
            input.on('data', chunk => data += chunk);
            input.on('error', error => console.log('Error', error.message));
            input.on('end', () => streamToStylesCSSDist.write(data));
            console.log('css file implemented successfully!')
        };
    };
});


// Запись изменённого шаблона в файл index.html в папке project-dist.
fs.open(pathToIndexHTMLDist, 'w', err => {
    if (err) throw err;
    console.log('index.html created!');
});

fs.readFile(pathToTemplateHTML, { encoding: 'utf-8' }, (err, string) => {
    if (err) throw err;

    fs.readdir(pathToComponents, (err, files) => {
        if (err) throw err;

        for (let i = 0; i < files.length; i++) {
            const fileExt = path.extname(files[i]);
            const fileName = path.basename(files[i], fileExt);
            const templateName = `{{${fileName}}}`;

            fs.readFile(path.join(pathToComponents, files[i]), { encoding: 'utf-8' }, (err, newString) => {
                if (err) throw err;

                string = string.replace(templateName, newString);

                fs.writeFile(pathToIndexHTMLDist, string, err => {
                    if (err) throw err;
                });
            });
        }
    });
});