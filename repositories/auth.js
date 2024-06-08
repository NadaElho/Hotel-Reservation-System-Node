const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

class AuthRepository {
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

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async getUserByResetToken(resetToken) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    return await User.findOne({
      resetToken: hashedToken,
      // passwordResetExpires: { $gt: Date.now() },
    });
  }

  async saveUser(user, options) {
    try {
      if (options && options.validateBeforeSave === false) {
        return await user.save({ validateBeforeSave: false });
      }
      return await user.save();
    } catch (error) {
      throw new Error("Error saving user: " + error.message);
    }
  }
}

module.exports = AuthRepository;
