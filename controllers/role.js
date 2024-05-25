class RoleController {
  constructor(roleRepository) {
    this.roleRepository = roleRepository
  }

  async getRole() {
    return await this.roleRepository.getRoles()
  }

  async addRole(body) {
    return await this.roleRepository.addRole(body)
  }

  async editRole(id, body) {
    return await this.roleRepository.editRole(id, body)
  }

  async deleteRole(id) {
    return await this.roleRepository.deleteRole(id)
  }
}

module.exports = RoleController
