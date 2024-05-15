const User = require('../models/user')

class UserRepository {
  constructor() {}

  async getAllUsers() {
    return User.find()
  }

  async getUserById(id) {
    return await User.findOne({ _id: id })
  }

  async addUser(newUser) {
    return await User.create(newUser)
  }

  async updateUser(id, body) {
    return await User.updateOne({ _id: id }, body)
  }

  async login(user) {
    return await User.findOne({ email: user.email })
  }

  async deleteUser(id) {
    return await User.deleteOne({ _id: id })
  }
}

module.exports = UserRepository
