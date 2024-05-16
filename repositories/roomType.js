const RoomType = require("../models/roomType");
const NotFoundError = require("../utils/notFoundError");
<<<<<<< HEAD
// class roomTypeRepository{

class RoomTypeRepository {
  async getAllRoomsType() {
    const roomType = await RoomType.find();
    if (!roomType) {
      throw new NotFoundError("No roomsType found");
=======
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
>>>>>>> c2aadbe40b0228e4e6fe005a76252b9a8a2e6e03
    }
    return roomType;
  }

<<<<<<< HEAD
  async getRoomTypeById(id) {
    return await RoomType.findOne(id);
  }

=======
>>>>>>> c2aadbe40b0228e4e6fe005a76252b9a8a2e6e03
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
