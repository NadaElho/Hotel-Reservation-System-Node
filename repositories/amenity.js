const Amenity = require('../models/amenity')

class AmenityRepository {
  async getAllAmenities(skip,limit) {
    const documentCount = await Amenity.countDocuments();
    const data= await Amenity.find().skip(skip).limit(limit);

    return { data, documentCount }
  }

  async getAmenityById(id) {
    return await Amenity.findOne({ _id: id })
  }
  async addAmenity(NewAmenity) {
    return await Amenity.create(NewAmenity)
  }

  async editAmenity(id, body) {
    return await Amenity.updateOne({ _id: id }, body)
  }

  async deleteAmenity(id) {
    return await Amenity.deleteOne({ _id: id })
  }
}
module.exports = AmenityRepository
