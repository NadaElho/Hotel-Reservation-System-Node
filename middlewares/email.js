const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // var transporter = nodemailer.createTransport({
  //   host: "gmail",
  //   // port: 2525,
  //   auth: {
  //     user: "abdelaziz.adel.m@gmail.com",
  //     pass: "byji rkio nvas afob",
  //   },
  // });

  const emailOptions = {
    from: "hotel system ",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  transporter.sendMail(emailOptions, function (err, success) {
    if (err) {
      console.log(err);
    } else {
      console.log(success);
    }
  });
};

module.exports = sendEmail;
