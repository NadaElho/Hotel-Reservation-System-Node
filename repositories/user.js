const User = require('../models/user')

class UserRepository {
  async getAllUsers() {
    return User.find()
  }

  async getUserById(id) {
    return await User.findOne({ _id: id })
  }

  async updateUser(id, body) {
    return await User.updateOne({ _id: id }, body)
  }

  async deleteUser(id) {
    return await User.deleteOne({ _id: id })
  }

}

module.exports = UserRepository
