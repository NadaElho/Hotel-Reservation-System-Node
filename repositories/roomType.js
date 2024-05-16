const RoomType = require("../models/roomType");
const NotFoundError = require("../utils/notFoundError");
class RoomTypeRepository {
  async getAllRoomsType() {
    const roomType = await RoomType.find();
    if (!roomType) {
      throw new NotFoundError("No roomsType found");
    }
    return roomType;
  }

  async getRoomTypeById(id) {
    const roomType=await RoomType.findOne(id)
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
