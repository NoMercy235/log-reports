const nodemailer = require("nodemailer");
const env = require('../env');

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    requireTLS: true,
    tls: true,
    auth: {
        user: env.email,
        pass: env.password
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
        from: `NoMercy235 VPS <${env.email}>`, // sender address
        to: env.destinationEmail, // list of receivers
        subject: parseSubject(env.subject), // Subject line
        text: parseBody(env.body), // plaintext body
        html: parseHtml(env.html) // html body
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
