
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, 
  secure: true, 
  auth: {
    user:process.env.USER_EMAIL,
    pass:process.env.USER_APP_PASSWORD, 
  },
});

module.exports = transport;















