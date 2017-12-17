const Subject = require('rxjs/Subject').Subject;
require('rxjs/add/observable/of');
require('rxjs/add/operator/map');
require('rxjs/add/operator/debounceTime');

const watch = require('node-watch');
const emailSender = require('./lib/email-sender');
const fileManager = require('./lib/file-manager');
const env = require('./env');

const subject = new Subject();

watch(env.watchPath, { recursive: true }, (event, name) => {
    console.log(event);
    console.log(name);
    if (event === 'update') {
        fileManager.readFile(name).then(() => {
            subject.next();
        });
    }
});

subject.debounceTime(1000).subscribe(() => {
    console.log('Should check result');
    if (env.mail.sendEmail) {
        emailSender({});
    }
    fileManager.emptyFile('./result/result.txt');
});
