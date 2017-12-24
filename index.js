const Subject = require('rxjs/Subject').Subject;
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

watch(env.watchPath, { recursive: true, filter: filter }, (event, name) => {
    if (event === 'update') {
        console.log('detected update in: ' + name);
        fileManager.readFile(name, env.resultPath).then(() => {
            subject.next();
        });
    }
});

subject.debounceTime(env.mail.debounceTime).subscribe(() => {
    emailSender();
    if (env.clearResult) {
        fileManager.emptyFile(env.resultPath);
    }
});
