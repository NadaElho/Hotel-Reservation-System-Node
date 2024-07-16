const Amenity = require("../models/amenity");

const NotFoundError = require("../handleErrors/notFoundError");
class AmenityRepository {
  async getAllAmenities(skip, limit) {
    const documentCount = await Amenity.countDocuments();
    const data = await Amenity.find().skip(skip).limit(limit);
    if (!data.length) {
      throw new NotFoundError("No Amenity  found");
    }
    return { data, documentCount };
  }

  async getAmenityById(id) {
    return await Amenity.findOne({ _id: id });
  }
  async addAmenity(NewAmenity) {
    return await Amenity.create(NewAmenity);
  }

  async editAmenity(id, body) {
    return await Amenity.updateOne({ _id: id }, body);
  }

  async deleteAmenity(id) {
    return await Amenity.deleteOne({ _id: id });
  }
}
module.exports = AmenityRepository;
