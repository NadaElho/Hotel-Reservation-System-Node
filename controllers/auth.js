const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
class AuthController {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async signup(newUser) {
    return await this.authRepository.signup(newUser);
  }

  async login(user) {
    if (!user.password) {
      throw new Error("must write your password");
    }

    if (!user.email) {
      throw new Error("must write your email");
    }

    const loggedUser = await this.authRepository.login(user);

    if (!loggedUser) {
      throw new Error("invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
      user.password,
      loggedUser.password
    );

    if (!passwordMatch) {
      throw new Error(" invalid email or password");
    }

    const token = jwt.sign(
      { id: loggedUser._id, email: loggedUser.email },
      process.env.JWT_SECRET_KEY
    );
    return token;
  }
}

module.exports = AuthController;
