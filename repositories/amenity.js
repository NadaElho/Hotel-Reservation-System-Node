const Amenity = require("../models/amenity");

class AmenityRepository {
  async getAllAmenities() {
    return await Amenity.find();
  }
  
  async getAmenityById(id){
    return await Amenity.findOne({_id:id})
  }
  async addAmenity(NewAmenity) {
    return await Amenity.create(NewAmenity);
  }
  
  async editAmenity(id, body) {  
    return await Amenity.updateOne({ _id: id }, body);
  }
  
  async deleteAmenity(id){
    return await Amenity.deleteOne({_id:id});
  }
}
module.exports = AmenityRepository;
