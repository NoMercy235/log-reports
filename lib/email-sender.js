const nodemailer = require("nodemailer");
const mailEnv = require('../env').mail;

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
    return subject;
}

function parseBody(body) {
    // TODO: parse body
    return body;
}

function parseHtml(html) {
    // TODO: parse html
    return html;
}

function prepareMail(entry) {
    let mailOptions = {
        from: `${mailEnv.from} <${mailEnv.email}>`, // sender address
        to: mailEnv.to, // list of receivers
        subject: parseSubject(mailEnv.subject), // Subject line
        text: parseBody(mailEnv.body), // plaintext body
        html: parseHtml(mailEnv.html) // html body
    };

    sendMail(mailOptions);
}

function sendMail(mailOptions) {
    console.log('Sending email...');
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response);
        }
        transport.close(); // shut down the connection pool, no more messages
    });
}

module.exports = prepareMail;
