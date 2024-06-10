const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const contact = () => {
  router.post("/", async (req, res) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: req.body.email,
      to: process.env.USER_EMAIL,
      subject: `Contact us from ${req.body.firstName}`,
      html: `<div>
                      <h3 style="color: #3b5d50;">${req.body.message}</h3>
          
              </div>`,
    };

    transporter.sendMail(mailOptions, (error, success) => {
      if (error) {
        console.log(error);
        res.send({ message: error.message });
      } else {
        console.log(`Email sent ${success.response}`);
        res.send({
          message: `Thank you for your message, ${firstName}. We will get back to you shortly.`,
        });
      }
    });
  });
};
module.exports = contact;

