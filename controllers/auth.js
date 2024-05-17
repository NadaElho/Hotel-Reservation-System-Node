const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BadRequestError = require("./../utils/badRequestError");

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

    if (!loggedUser) {
      throw new BadRequestError("invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
      user.password,
      loggedUser.password
    );

    if (!passwordMatch) {
      throw new BadRequestError("invalid email or password");
    }

    const token = jwt.sign(
      { id: loggedUser._id, email: loggedUser.email },
      process.env.JWT_SECRET_KEY
    );
    return token;
  }
}

module.exports = AuthController;
