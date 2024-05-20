class AmenityController {
    constructor(amenityRepository) {
      this.amenityRepository = amenityRepository;
    }
   async getAllAmenities() {
      return await this.amenityRepository.getAllAmenities();
    }
    
    async getAmenityById(id){
      return await this.amenityRepository.getAmenityById(id);
    }
    
    async addAmenity(NewAmenity){
     return await this.amenityRepository.addAmenity(NewAmenity)
    }
    
    async editAmenity(id,body){
     return await this.amenityRepository.editAmenity(id,body)
    }
    
    async deleteAmenity(id) {
     return await this.amenityRepository.deleteAmenity(id);
    }
  }
  module.exports = AmenityController;
  