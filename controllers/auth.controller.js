// const User = require("./../models/user.model");
const jwt = require("jsonwebtoken");
const AppError = require("./../unites/appError");
class UserController {
  constructor(UserRepository) {
    this.UserRepository = UserRepository;
  }

  async getAllUsers() {
    return this.UserRepository.getAllUsers();
  }

  getUserById(id) {
    return this.UserRepository.getUserById(id);
  }

  addUser(newUser) {
    return this.UserRepository.addUser(newUser);
  }

  updateUser(id, body) {
    return this.UserRepository.updateUser(id, body);
  }
  async login(user) {
    if (user) {
      const loggedUser = await this.UserRepository.login(user);
      const token = jwt.sign(
        { id: loggedUser._id, email: loggedUser.email },
        "JWT_SECRET"
      );
      return token;
    } else {
      throw new AppError("User not found", 404);
    }
  }

  deleteUser(id) {
    return this.UserRepository.deleteUser(id);
  }
}

module.exports = UserController;
