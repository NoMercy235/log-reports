const fs = require('fs');
const nodemailer = require("nodemailer");
const env = require('../env');
const mailEnv = env.mail;
const moment = require('moment');

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
    if (!entry) return html;

    const htmlAddress = `
<p>Weather for <b>${entry.weatherApp.geocode.formattedAddress}</b>:</p>
<ul>
    <li>Degrees: <b>${entry.weatherApp.weather.main.temp}</b></li>
    <li>Wind: <b>${entry.weatherApp.weather.wind.speed}</b> m/s with a degree of <b>${entry.weatherApp.weather.wind.deg}</b></li>
    <li>Humidity: <b>${entry.weatherApp.weather.main.humidity}%</b></li>
    <li>Visibility: <b>${entry.weatherApp.weather.visibility}</b> meters</li>
    <li>Sunrise at: <b>${moment.unix(entry.weatherApp.weather.sys.sunrise).format('HH:mm:ss')}</b></li>
    <li>Sunset at: <b>${moment.unix(entry.weatherApp.weather.sys.sunset).format('HH:mm:ss')}</b></li>
</ul>
`;
    return html
        .replace(/%%WEATHER%%/, htmlAddress);
}

function prepareMail(entry) {
    let mailOptions = {
        from: `${mailEnv.from} <${mailEnv.email}>`, // sender address
        to: mailEnv.to, // list of receivers
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

function sendMail(mailOptions) {
    console.log('Sending email...');
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent.");
        }
        transport.close(); // shut down the connection pool, no more messages
    });
}

module.exports = prepareMail;
