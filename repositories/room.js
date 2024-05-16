const Room = require("../models/room");
const NotFoundError = require("../utils/notFoundError");
class roomRepository {
  async getAllRooms(query, sortBy, skip, limit) {
    const documentCount = await Room.countDocuments(query);
    const data = await Room.find(query)
      .populate("roomTypeId")
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    if (!data) {
      throw new NotFoundError("No rooms found");
    }

    return { data, documentCount };
  }

  async getRoomById(id) {
    const room = await Room.findOne(id)
      .populate("amentiesIds")
      .populate("hotelId")
      .populate("roomTypeId");

    if (!room) {
      throw new NotFoundError("The room with this ID was not found");
    }
    return room;
  }

  async addRoom(req) {
    return await Room.create(req);
  }
  async editRoom(id, req) {
    return await Room.updateOne(id, req);
  }
  async deleteRoom(id) {
    return await Room.deleteOne(id);
  }
}

module.exports = roomRepository;
