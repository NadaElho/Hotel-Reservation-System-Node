const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const BadRequestError = require("../handleErrors/badRequestError");

class AuthRepository {
  // async signup(newUser) {
  //   const hashedPassword = await bcrypt.hash(newUser.password, 10);

  //   return await User.create({
  //     firstName: newUser.firstName,
  //     lastName: newUser.lastName,
  //     email: newUser.email,
  //     password: hashedPassword,
  //     role: newUser.role,
  //   });
  // }
  async signup(newUser) {
    return await User.create(newUser);
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
      passwordResetExpires: { $gt: Date.now() },
    });
  }

  async saveUser(user, options) {
    if (options && options.validateBeforeSave === false) {
      const result = await user.save({ validateBeforeSave: false });
      if (!result) {
        throw new BadRequestError("Error saving user");
      }
      return result;
      // } else {
      //   const result = await user.save();
      //   if (!result) {
      //     throw new BadRequestError("Error saving user");
      //   }
      //   return result;
    }
  }
}
module.exports = AuthRepository;
