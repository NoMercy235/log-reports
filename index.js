const Subject = require('rxjs/Subject').Subject;
const weatherApp = require('@nomercy235/weather-app');
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

subject.debounceTime(env.mail.debounceTime).subscribe(async () => {
    if (env.clearResult === 'before') {
        fileManager.emptyFile(env.resultPath);
    }

    for (let file of changedFiles) {
        await fileManager.readFile(file, env.resultPath);
    }

    if (env.weatherApp) {
        const keys = env.weatherApp.keys;
        weatherApp.getWeatherForAddress(env.weatherApp.address, keys, env.weatherApp.options).then(weatherApp => {
            emailSender({ weatherApp: weatherApp });
            changedFiles = [];
            if (env.clearResult === 'after') {
                fileManager.emptyFile(env.resultPath);
            }
        }).catch(err => {
            console.error(err);
            emailSender();
        });
    } else {
        emailSender();
    }
});
