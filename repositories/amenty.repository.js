const Amenty = require("../models/amenty.model");

class amentyRepository {
  async getAllAmenties() {
    return await Amenty.find();
  }
  //
  async getAmentyById(id){
    return await Amenty.findOne({_id:id})
  }
  async addAmenty(NewAmenty) {
    return await Amenty.create(NewAmenty);
  }
  //
  async editAmenty(id, body) {
    
    return await Amenty.updateOne({ _id: id }, body);
  }
  //
  async deleteAmenty(id){
    return await Amenty.deleteOne({_id:id});
}
}
module.exports = amentyRepository;
