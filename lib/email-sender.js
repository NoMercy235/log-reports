const fs = require('fs');
const nodemailer = require("nodemailer");
const env = require('../env');
const mailEnv = env.mail;
const moment = require('moment');
const weatherTemplate = require('../assets/weather-template');

const transport = nodemailer.createTransport({
    service: mailEnv.service,
    port: mailEnv.port,
    secure: false,
    requireTLS: true,
    tls: true,
    auth: {
        user: mailEnv.email,
        pass: mailEnv.password
    }
});

function parseSubject(subject) {
    // TODO: parse subject
    return subject
        .replace(/%%DATE%%/, (moment().format("YYYY-MM-DD HH:mm")));
}

function parseBody(body) {
    // TODO: parse body
    return body;
}

function parseHtml(html, entry) {
    return html.replace(
      /%%WEATHER%%/,
      entry
        ? weatherTemplate.getTemplate(entry.weatherApp)
        : '<span>Weather address not found!</span>'
    );
}

function prepareMail(entry) {
    let mailOptions = {
        from: `${mailEnv.from} <${mailEnv.email}>`, // sender address
        to: Array.isArray(mailEnv.to) ? mailEnv.to.join(',') : mailEnv.to, // list of receivers
        subject: parseSubject(mailEnv.subject), // Subject line
        text: parseBody(mailEnv.body), // plaintext body
        html: parseHtml(mailEnv.html, entry), // html body
        attachments: [
            {
                filename: 'result.txt',
                content: fs.createReadStream(env.resultPath),
            },
        ],
    };

    if (env.mail.sendEmail) {
        sendMail(mailOptions);
    }
}

function getCurrentDate () {
    const date = new Date();
    return `${date.toDateString()} - ${date.toTimeString().split(' ')[0]}`;
}

function sendMail(mailOptions) {
    console.log('Sending email...');
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log(`Message sent on ${getCurrentDate()}`);
        }
        transport.close(); // shut down the connection pool, no more messages
    });
}

module.exports = prepareMail;
