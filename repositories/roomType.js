const RoomType = require("../models/roomType");
const NotFoundError = require("../handleErrors/notFoundError");
class RoomTypeRepository {
  async getAllRoomsType(skip, limit) {
    const documentCount = await RoomType.countDocuments();
    const data = await RoomType.find().skip(skip).limit(limit);
    //TODO:

    if (!data.length) {
      throw new NotFoundError("No roomsType found");
    }
    return { data, documentCount };
  }

  async getRoomTypeById(id) {
    const roomType = await RoomType.findOne(id);
    if (!roomType) {
      throw new NotFoundError("The room Type with this ID was not found");
    }
    return roomType;
  }

  async addRoomType(req) {
    return await RoomType.create(req);
  }

  async editRoomType(id, req) {
    return await RoomType.updateOne(id, req);
  }

  async deleteRoomType(id) {
    return await RoomType.deleteOne(id);
  }
}

module.exports = RoomTypeRepository;
