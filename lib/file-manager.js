const fs = require('fs');
const env = require('../env');
const writeResult = fs.createWriteStream(env.resultPath);

function readFile(path) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(path);
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

module.exports = {
    readFile: readFile,
    emptyFile: emptyFile,
};
