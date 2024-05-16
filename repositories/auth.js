const User = require("../models/user");
const bcrypt = require("bcrypt");

class AuthRepository {
  constructor() {}

  async signup(newUser) {
    const hashedPassword = await bcrypt.hash(newUser.password, 12);

    return await User.create({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: hashedPassword,
      role: newUser.role,
    });
  }

  async login(user) {
    return await User.findOne({ email: user.email });
  }
}

module.exports = AuthRepository;
