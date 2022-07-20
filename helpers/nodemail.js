require('dotenv').config()
var nodemailer = require('nodemailer');

function confirmComplete(res) {
  
    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "sraaen@gmail.com", //process.env.NODEMAILADDRESS,
        pass: "feanekyvrkhaimgc" //process.env.NODEMAILPW
      }
    });

    var mailOptions = {
      from: 'sraaen@gmail.com', //process.env.NODEMAILADDRESS,
      to: 'sraaen@gmail.com',
      subject: res,
      text: res
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response + res);
      
      }
    });
  }

module.exports = confirmComplete