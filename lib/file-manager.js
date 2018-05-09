const fs = require('fs');
const path = require('path');

function ensurePathExistence(userPath, isDir) {
    const dirname = isDir ? userPath : path.dirname(userPath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensurePathExistence(dirname);
    fs.mkdirSync(dirname);
}

function readFile(path, resultPath) {
    return new Promise((resolve, reject) => {

        const readStream = fs.createReadStream(path);
        const writeResult = fs.createWriteStream(resultPath, { flags: 'a' });

        readStream.on('end', () => {
            resolve();
        });

        readStream.on('error', (err) => {
            writeResult.write(err.toString() + '\n');
        });
        readStream.pipe(writeResult, { end: false });
    });
}

function emptyFile(path) {
    return new Promise((resolve, reject) => {
        fs.truncate(path, 0, (err, data) => {
            if (err) reject();
                else
                    resolve();
        });
    });
}

function fileExists(path, sync = false) {
    if (sync) {
        return fs.existsSync(path);
    } else {
        return new Promise((resolve, reject) => {
            fs.exists(path, (exists) => resolve(exists));
        });
    }
}

module.exports = {
    ensurePathExistence: ensurePathExistence,
    readFile: readFile,
    emptyFile: emptyFile,
    fileExists: fileExists,
};
