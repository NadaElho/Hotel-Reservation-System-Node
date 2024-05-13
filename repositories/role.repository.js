const Role = require("../models/role.model")

class roleRepository {
  async getRoles() {
    const roles = await Role.find()
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

module.exports = roleRepository
