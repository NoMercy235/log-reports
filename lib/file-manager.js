const fs = require('fs');

function readFile(path, resultPath) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(path);
        const writeResult = fs.createWriteStream(resultPath);

        readStream.on('end', () => {
            resolve();
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
    readFile: readFile,
    emptyFile: emptyFile,
    fileExists: fileExists,
};
