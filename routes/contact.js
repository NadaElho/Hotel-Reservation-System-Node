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
      subject: `Message from ${req.body.firstName}`,
      html: `<div>
                <h3 style="color: #7c6555;">${req.body.message}</h3>
              </div>`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.response}`);
      res.status(200).json({
        message: `Thank you for your message, ${req.body.firstName}. We will get back to you shortly.`,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  return router;
};

module.exports = contact;
