const Subject = require('rxjs/Subject').Subject;
const fork = require('child_process').fork;
require('rxjs/add/observable/of');
require('rxjs/add/operator/map');
require('rxjs/add/operator/debounceTime');

const watch = require('node-watch');
const fileManager = require('./lib/file-manager');

const envExists = fileManager.fileExists('./env.js', true);

if (!envExists) {
    console.error('No environment file detected. Please create env.js in root folder.');
    process.exit(1);
}

const emailSender = require('./lib/email-sender');
const env = require('./env');

fileManager.ensurePathExistence(env.watchPath, true);
fileManager.ensurePathExistence(env.resultPath, false);

const subject = new Subject();
const filter = (name) => env.resultPath.indexOf(name) === -1;

let changedFiles = [];

watch(env.watchPath, { recursive: true, filter: filter }, (event, name) => {
    if (event === 'update') {
        subject.next();
        if (!changedFiles.includes(name)) changedFiles.push(name);
    }
});

subject.debounceTime(env.mail.debounceTime).subscribe(() => {
    let promises = [];
    changedFiles.forEach(file => promises.push(fileManager.readFile(file, env.resultPath)));
    Promise.all(promises).then(() => {
        const child = fork('../weather-app/index.js', ['-a', env.address], {
            stdio: 'pipe'
        });
        child.on('message', function(weatherApp) {
            emailSender({ weatherApp: weatherApp });
            if (env.clearResult) {
                fileManager.emptyFile(env.resultPath);
            }
        });
    });
});
