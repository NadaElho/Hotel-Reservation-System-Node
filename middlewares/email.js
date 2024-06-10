const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  // var transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: "hotel system ",
    to: "abdelazizadel1328@gmail.com",
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
