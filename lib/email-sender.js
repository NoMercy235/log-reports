const fs = require('fs');
const nodemailer = require("nodemailer");
const env = require('../env');
const mailEnv = env.mail;
const moment = require('moment');
const weatherTemplate = require('../assets/weather-template');
const puppeteerScreenshot = require('./puppeteer-screenshot');

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

async function getPuppeteerScreenshot() {
    console.log('Starting the screenshot procedure');
    await puppeteerScreenshot.getWeatherScreenshot();
    await puppeteerScreenshot.getUSYieldCurveScreenshot();
    console.log('Finished taking the screenshot');
}

function parseHtml(html, entry) {
    return html.replace(
      /%%WEATHER%%/,
      entry
        ? weatherTemplate.getTemplate(entry.weatherApp)
        : '<span>Weather address not found!</span>'
    );
}

async function prepareMail(entry) {
    if (!entry) {
        await getPuppeteerScreenshot();
    }

    let mailOptions = {
        from: `${mailEnv.from} <${mailEnv.email}>`, // sender address
        to: Array.isArray(mailEnv.to) ? mailEnv.to.join(',') : mailEnv.to, // list of receivers
        subject: parseSubject(mailEnv.subject), // Subject line
        text: parseBody(mailEnv.body), // plaintext body
        html: await parseHtml(mailEnv.html, entry), // html body
        attachments: [
            {
                filename: 'result.txt',
                content: fs.createReadStream(env.resultPath),
            },
            {
                filename: 'weather.png',
                content: fs.createReadStream('./weather.png'),
            },
            {
                filename: 'yield.png',
                content: fs.createReadStream('./yield.png'),
            },
        ],
    };

    if (env.mail.sendEmail) {
        sendMail(mailOptions);
    }

    fs.unlinkSync('weather.png');
    fs.unlinkSync('yield.png');
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
