class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async getAllUsers() {
    return await this.userRepository.getAllUsers()
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
