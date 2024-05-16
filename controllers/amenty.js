class AmentyController {
    constructor(AmentyRepository) {
      this.AmentyRepository = AmentyRepository;
    }
    getAllAmenties() {
      return this.AmentyRepository.getAllAmenties();
    }
    
    getAmentyById(id){
      return this.AmentyRepository.getAmentyById(id);
    }
    
    addAmenty(NewAmenty){
     return this.AmentyRepository.addAmenty(NewAmenty)
    }
    
    editAmenty(id,body){
     return this.AmentyRepository.editAmenty(id,body)
    }
    
    deleteAmenty(id) {
     return this.AmentyRepository.deleteAmenty(id);
    }
  }
  module.exports = AmentyController;
  