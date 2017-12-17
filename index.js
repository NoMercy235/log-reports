const Subject = require('rxjs/Subject').Subject;
require('rxjs/add/observable/of');
require('rxjs/add/operator/map');
require('rxjs/add/operator/debounceTime');

const watch = require('node-watch');
const emailSender = require('./lib/email-sender');
const fileManager = require('./lib/file-manager');
const env = require('./env');

const subject = new Subject();
const filter = (name) => env.resultPath.indexOf(name) === -1;

watch(env.watchPath, { recursive: true, filter: filter }, (event, name) => {
    if (event === 'update') {
        fileManager.readFile(name).then(() => {
            subject.next();
        });
    }
});

subject.debounceTime(env.mail.debounceTime).subscribe(() => {
    if (env.mail.sendEmail) {
        emailSender();
    }
    fileManager.emptyFile(env.resultPath);
});
