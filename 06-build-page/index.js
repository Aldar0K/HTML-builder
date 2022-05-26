const path = require('path');
const fsp = require('fs/promises');

// Пути.
const pathToTemplateHTML = path.join(__dirname, 'template.html');
const pathToAssetsSrc = path.join(__dirname, 'assets');
const pathToStylesSrc = path.join(__dirname, 'styles');
const pathToComponents = path.join(__dirname, 'components');

const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToAssetsDist = path.join(pathToProjectDist, 'assets');
const pathToIndexHTMLDist = path.join(pathToProjectDist, 'index.html');
const pathToStylesCSSDist = path.join(pathToProjectDist, 'style.css');


// Запись изменённого шаблона в файл index.html в папке project-dist.
async function buildHTML(pathToComponents, pathToTemplateHTML, pathToIndexHTMLDist) {
    const componentsFiles = await fsp.readdir(pathToComponents, { withFileTypes: true });
    let html = await fsp.readFile(pathToTemplateHTML, 'utf-8');

    for (const file of componentsFiles) {
        const fileParsed = path.parse(path.join(pathToComponents, file.name));
        const fileExt = fileParsed.ext;
        const fileName = fileParsed.name;

        if (file.isDirectory() || fileExt !== '.html') continue;
        
        const fileData = await fsp.readFile(path.join(pathToComponents, file.name), 'utf-8');
        html = html.replace(`{{${fileName}}}`, fileData);
    }

    fsp.writeFile(pathToIndexHTMLDist, html);
}


// Объединение файлов стилей из папки styles в style.css в папке project-dist.
async function buildCSS(pathToStylesSrc, pathToStylesCSSDist) {
    const cssFiles = await fsp.readdir(pathToStylesSrc, { withFileTypes: true });

    for (const file of cssFiles) {
        const fileParsed = path.parse(path.join(pathToStylesSrc, file.name));
        const fileExt = fileParsed.ext;

        if (file.isDirectory() || fileExt !== '.css') continue;

        const fileData = await fsp.readFile(path.join(pathToStylesSrc, file.name), 'utf-8');
        await fsp.appendFile(pathToStylesCSSDist, fileData);
    }
}


// Копирование папки assets в project-dist.
async function copyFolder(pathToAssetsSrc, pathToAssetsDist) {
    const fileStats = await fsp.stat(pathToAssetsSrc, { withFileTypes: true });

    if (fileStats.isDirectory()) {
        await fsp.mkdir(path.join(pathToAssetsDist));
        const assetsFiles = await fsp.readdir(path.join(pathToAssetsSrc));

        for (const file of assetsFiles) {
            copyFolder(path.join(pathToAssetsSrc, file), path.join(pathToAssetsDist, file))
        }
    } else if (fileStats.isFile()) {
        fsp.copyFile(pathToAssetsSrc, pathToAssetsDist);
    }
}


// Асинхронная функция для сбора папки project-dist.
(async () => {
    await fsp.rm(pathToProjectDist, { force: true, recursive: true });
    await fsp.mkdir(pathToProjectDist);

    buildHTML(pathToComponents, pathToTemplateHTML, pathToIndexHTMLDist);
    buildCSS(pathToStylesSrc, pathToStylesCSSDist);
    copyFolder(pathToAssetsSrc, pathToAssetsDist);
})();