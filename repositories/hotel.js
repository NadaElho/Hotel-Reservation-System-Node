const Hotel = require("../models/hotel");

class hotelRepository {
  async getAllHotels() {
    return await Hotel.find();
  }
  
  async getHotelById(id){
    return await Hotel.findOne({_id:id})
  }
  async addHotel(newHotel) {
    return await Hotel.create(newHotel);
  }
  
  async editHotel(id, body) {
    return await Hotel.updateOne({ _id: id }, body);
  }
  
  async deleteHotel(id){
    return await Hotel.deleteOne({_id:id});
  }
}
module.exports = hotelRepository;
