const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BadRequestError = require("../handleErrors/badRequestError");

class AuthController {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async signup(newUser) {
    return await this.authRepository.signup(newUser);
  }

  async login(user) {
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

    // console.log(loggedUser.password);
    // console.log(user.password);

    if (!loggedUser) {
      throw new BadRequestError("invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
      user.password,
      loggedUser.password
    );

    const userByEmail = await this.authRepository.getUserByEmail(user.email);

    const { role, _id } = userByEmail;

    if (!passwordMatch) {
      throw new BadRequestError("invalid email or password");
    }

    const token = jwt.sign(
      { id: loggedUser._id, email: loggedUser.email },
      process.env.JWT_SECRET_KEY
    );
    return { token, role, id: _id };
  }

  async forgotPassword(email) {
    const user = await this.authRepository.getUserByEmail(email);
    if (!user) {
      throw new BadRequestError(
        "There is no user with that email address.",
        404
      );
    }

    const resetToken = user.createPasswordResetToken();
    user.addToken(resetToken);

    const resetURL = `127.0.0.1:3000/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 min)",
        message,
      });

      return { status: "success", message: "Token sent to email!" };
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await this.authRepository.saveUser(user, { validateBeforeSave: false });

      throw new BadRequestError(
        "There was an error sending the email. Try again later!",
        500
      );
    }
  }

  async resetPassword(resetToken, newPassword) {
    const user = await this.authRepository.getUserByResetToken(resetToken);
    if (!user) {
      throw new BadRequestError("Token is invalid or has expired", 400);
    }

    await user.resetPassword(newPassword);

    await this.authRepository.saveUser(user);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY
    );

    return { token };
  }
}

module.exports = AuthController;
