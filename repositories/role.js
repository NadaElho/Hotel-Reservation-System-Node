const Role = require('../models/role')
const NotFoundError = require('../handleErrors/notFoundError')

class RoleRepository {
  async getRoles() {
    const roles = await Role.find()
    if (!roles.length) {
      throw new NotFoundError('No roles found')
    }
    return roles
  }

  async addRole(body) {
    await Role.create(body)
  }

  async editRole(id, body) {
    await Role.updateOne({ _id: id }, body)
  }

  async deleteRole(id) {
    await Role.deleteOne({ _id: id })
  }
}

module.exports = RoleRepository
