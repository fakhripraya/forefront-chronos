const fs = require('fs');
const { DYNAMIC_ASSET_FOLDER_PATH } = require('../variables/general');

function createFileFromBase64(userName, fileType, fileNameWithExtension, fileImage) {
    let { fileName, fileExtension } = splitFileNameAndExtension(fileNameWithExtension);
    const match = fileImage.match(/^data:([a-z]+\/[a-z0-9-+.]+);base64,/);
    if (match) fileExtension = match[1].split('/')[1];

    const namaFile = `${fileName}.${fileExtension}`;
    const folderPath = `${DYNAMIC_ASSET_FOLDER_PATH}/${userName}/${fileType}`;
    const folder = fs.existsSync(folderPath);
    if (!folder) {
        var err = createFolder(folderPath);
        if (err) return { result: null, error: err, status: 400 };
    }

    const imageData = Buffer.from(fileImage, "base64");
    try {
        fs.writeFileSync(`${folderPath}/${namaFile}`, imageData);
    } catch (err) {
        return { result: null, error: err, status: 400 };
    }

    return { result: folderPath, error: null, status: 201 };
}

function splitFileNameAndExtension(filePath) {
    const fileNameWithExtension = filePath.split("/").pop();
    const indexOfLastDot = fileNameWithExtension.lastIndexOf(".");
    const fileName = fileNameWithExtension.substring(0, indexOfLastDot);
    const fileExtension = fileNameWithExtension.substring(indexOfLastDot + 1);

    return { fileName, fileExtension };
}

function readFile(path) {
    try {
        fs.readFileSync(path, "utf8");
    } catch (err) {
        return { result: null, error: err, status: 400 };
    }
}

function deleteFileOrFolder(path) {
    fs.rmSync(path, { force: true, recursive: true });
}

function createFolder(folderPath) {
    fs.mkdirSync(folderPath, { recursive: true }, (err) => {
        if (err) return err;
        else return null;
    })
};

function moveFile(namaFile, folderPath) {
    fs.moveSync(namaFile, folderPath, { overwrite: true }, err => {
        if (err) return err;
        else return null;
    });
}

function searchFile() {
    try {
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createFolder,
    readFile,
    createFileFromBase64,
    moveFile,
    searchFile,
    deleteFileOrFolder
};
