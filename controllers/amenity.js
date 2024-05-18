class AmenityController {
    constructor(amenityRepository) {
      this.amenityRepository = amenityRepository;
    }
    getAllAmenities() {
      return this.amenityRepository.getAllAmenities();
    }
    
    getAmenityById(id){
      return this.amenityRepository.getAmenityById(id);
    }
    
    addAmenity(NewAmenity){
     return this.amenityRepository.addAmenity(NewAmenity)
    }
    
    editAmenity(id,body){
     return this.amenityRepository.editAmenity(id,body)
    }
    
    deleteAmenity(id) {
     return this.amenityRepository.deleteAmenity(id);
    }
  }
  module.exports = AmenityController;
  