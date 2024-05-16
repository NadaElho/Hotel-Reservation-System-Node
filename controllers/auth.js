const jwt = require('jsonwebtoken')
const NotFoundError = require('../utils/notFoundError')

class AuthController {
  constructor(UserRepository) {
    this.UserRepository = UserRepository
  }

  async getAllUsers() {
    return await this.UserRepository.getAllUsers()
  }

  async getUserById(id) {
    return await this.UserRepository.getUserById(id)
  }

  async addUser(newUser) {
    return await this.UserRepository.addUser(newUser)
  }

  async updateUser(id, body) {
    return await this.UserRepository.updateUser(id, body)
  }
  async login(user) {
    if (user) {
      const loggedUser = await this.UserRepository.login(user)
      console.log(loggedUser)
      const token = jwt.sign(
        { id: loggedUser._id, email: loggedUser.email },
        process.env.JWT_SECRET_KEY,
      )
      return token
    } else {
      throw new NotFoundError('User not found')
    }
  }

  deleteUser(id) {
    return this.UserRepository.deleteUser(id)
  }
}

module.exports = AuthController
