const path = require('path');
const fs = require('fs');

const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToAssetsDist = path.join(pathToProjectDist, 'assets');
const pathToIndexHTMLDist = path.join(pathToProjectDist, 'index.html');
const pathToStylesCSSDist = path.join(pathToProjectDist, 'style.css');

const pathToTemplateHTML = path.join(__dirname, 'template.html');
const pathToAssetsSrc = path.join(__dirname, 'assets');
const pathToStylesSrc = path.join(__dirname, 'styles');
const pathToComponents = path.join(__dirname, 'components');

// Функция для создания папок.
function makeFolder(path) {
    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) throw err;

        console.log(`Folder created successfully!`);
    });
}

// Создание папки project-dist и assets в project-dist.
makeFolder(pathToProjectDist);

// Создание папки assets в project-dist.
makeFolder(pathToAssetsDist);

// Копирование папки assets в папку assets в project-dist.
fs.readdir(pathToAssetsSrc, (err, items) => {
    if (err) throw err;

    items.forEach(item => {
        const itemSrcPath = path.join(pathToAssetsSrc, item);
        const itemDestPath = path.join(pathToAssetsDist, item);

        makeFolder(itemDestPath);

        fs.readdir(itemSrcPath, (err, files) => {
            if (err) throw err;

            files.forEach(file => {
                const fileSrcPath = path.join(itemSrcPath, file);
                const fileDestPath = path.join(itemDestPath, file);

                fs.copyFile(fileSrcPath, fileDestPath, err => {
                    if (err) throw err;
                });
            });
        });
    });
});

// Объединение файлов стилей из папки styles в style.css в папке project-dist.