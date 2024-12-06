const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:465,
    secure:true,
    auth:{
        user:process.env.USER_EMAIL,
        pass:process.env.USER_PASSWORD
    }
});

module.exports = transport;
