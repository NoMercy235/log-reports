const watch = require('node-watch');
const emailSender = require('./lib/email-sender');


watch('./test', { recursive: true }, (event, name) => {
    console.log(event);
    console.log(name);
    emailSender({});
});
