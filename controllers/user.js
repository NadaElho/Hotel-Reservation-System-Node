const bcrypt = require("bcrypt");
const BadRequestError = require("../handleErrors/badRequestError");

class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers(skip, limit) {
    return await this.userRepository.getAllUsers(skip, limit);
  }

  async getUserById(id) {
    return await this.userRepository.getUserById(id);
  }

  async updateUser(id, body) {
    return await this.userRepository.updateUser(id, body);
  }

  async updaeUserPassword(id, body) {
    const user = await this.getUserById(id);
    const isCorrectPassword = await bcrypt.compare(
      body.currentPassword,
      user.password
    );
    if (!isCorrectPassword) {
      throw new BadRequestError("Old password is incorrect");
    }
    const newPassword = await bcrypt.hash(body.newPassword, 10);
    return await this.userRepository.updaeUserPassword(id, newPassword);
  }

  deleteUser(id) {
    return this.userRepository.deleteUser(id);
  }

  async addSubscriptionToUser(subscriptionId, userId) {
    return await this.userRepository.addSubscriptionToUser(
      subscriptionId,
      userId
    );
  }
  async deleteSubscriptionToUser(userId) {
    return await this.userRepository.deleteSubscriptionToUser(userId);
  }
}

module.exports = UserController;
