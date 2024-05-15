class roleController {
    constructor(roleRepository) {
      this.roleRepository = roleRepository
    }

    getRole() {
      return this.roleRepository.getRole()
    }
  
    async addRole(body){
      return await this.roleRepository.addRole(body)
    }
  
    editRole(id, body){
      return this.roleRepository.editRole(id, body)
    }
  
    async deleteRole(id){
      return await this.roleRepository.deleteRole(id)
    }
  }
  
  module.exports = roleController
  