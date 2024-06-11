const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BadRequestError = require("../handleErrors/badRequestError");
const sendEmail = require("./../middlewares/email");
const nodemailer = require("nodemailer");
require("dotenv").config();
class AuthController {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async signup(newUser) {
    // return await User.create({
    //   firstName: newUser.firstName,
    //   lastName: newUser.lastName,
    //   email: newUser.email,
    //   password: hashedPassword,
    //   role: newUser.role,
    // });

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    return await this.authRepository.signup({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: hashedPassword,
      role: newUser.role,
    });
  }

  async login(user) {
    // console.log(user);
    if (!user.password && !user.email) {
      throw new BadRequestError("must write your email and your password");
    }

    if (!user.password) {
      throw new BadRequestError("must write your password");
    }

    if (!user.email) {
      throw new BadRequestError("must write your email");
    }

    const loggedUser = await this.authRepository.login(user);

    // console.log(loggedUser);

    if (!loggedUser) {
      throw new BadRequestError("invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
      user.password,
      loggedUser.password
    );

    // console.log(passwordMatch);

    const userByEmail = await this.authRepository.getUserByEmail(user.email);

    const { role, _id } = userByEmail;

    // console.log(userByEmail);

    // if (!passwordMatch) {
    //   throw new BadRequestError("invalid email or password");
    // }

    const token = jwt.sign(
      { id: loggedUser._id, email: loggedUser.email },
      process.env.JWT_SECRET_KEY
    );
    // console.log(token);
    return { token, role, id: _id };
  }

  async forgotPassword(email, req) {
    const user = await this.authRepository.getUserByEmail(email);

    // console.log(user);

    if (!user) {
      throw new BadRequestError(
        "There is no user with that email address.",
        404
      );
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });
    // await this.authRepository.saveUser(user);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abdelaziz.adel.m13@gmail.com",
        pass: "kynw ohvo uerx wqbg",
      },
    });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const mailOptions = {
      from: "hotel system ",
      to: "abdelazizadel1328@gmail.com",
      subject: "Reset password",
      html: `<div>
      <h3>Hello, <span style='color: #f8b810'>${user.name}</span></h3>
      <h4>Click on the link below to reset yor password</h4>
      <p>${resetURL}</p>
      </div>`,
    };

    transporter.sendMail(mailOptions, (err, success) => {
      if (err) {
        console.log(err);
      } else {
        s;
        console.log("Email sent: " + success.response);
      }
    });

    return resetToken;
  }

  async resetPassword(resetToken, newPassword) {
    const user = await this.authRepository.getUserByResetToken(resetToken);

    if (!user) {
      throw new BadRequestError("Token is invalid or has expired", 400);
    }

    console.log(newPassword);
    await user.resetPassword(newPassword);

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY
    );

    return token;
  }
}

module.exports = AuthController;
