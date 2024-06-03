class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async getAllUsers( skip, limit) {
    return await this.userRepository.getAllUsers(skip, limit)
  }

  async getUserById(id) {
    return await this.userRepository.getUserById(id)
  }

  async updateUser(id, body) {
    return await this.userRepository.updateUser(id, body)
  }

  deleteUser(id) {
    return this.userRepository.deleteUser(id)
  }
}

module.exports = UserController
