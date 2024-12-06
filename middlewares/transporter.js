
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, 
  secure: true, 
  auth: {
    user:'shobankhan5598@gmail.com',
    pass:'yqjgqwtsckemjwhu', 
  },
});

module.exports = transport;














