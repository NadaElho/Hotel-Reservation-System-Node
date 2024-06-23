const Room = require("../models/room");
const NotFoundError = require("../handleErrors/notFoundError");
const Reservation = require("../models/reservation");
const User = require("../models/user");
class roomRepository {
  async getAllRooms(query, sortBy, skip, limit) {
    const documentCount = await Room.countDocuments(query);
    const data = await Room.find(query)
      .populate("roomTypeId")
      .populate("hotelId")
      .populate("amenitiesIds")
      .populate("promotionId")
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
    //TODO:
    if (!data || data.length === 0) {
      throw new NotFoundError("No rooms found");
    }

    return { data, documentCount };
  }

  async getRoomById(id) {
    const room = await Room.findOne(id)
      .populate("amenitiesIds")
      .populate("hotelId")
      .populate("roomTypeId")
      .populate("promotionId");

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
  // **favourite**
  async getRoomsInFavourite(userId) {
    const user = await User.findById(userId).populate("favouriteRooms");
    if (!user) throw new NotFoundError("user not found");
    return user.favouriteRooms;
  }

  async addRoomToFavourite(userId, roomId) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("user not found");
    const isFavorited = user.favouriteRooms.find(
      (id) => id.toString() === roomId
    );
    if (isFavorited) {
      throw new Error("Room already added to favourites");
    }
    user.favouriteRooms.push(roomId);
    console.log(user);
    await user.save();
    return user;
  }

  async deleteRoomFromFavourite(userId, roomId) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("user not found");
    const room = user.favouriteRooms.findIndex(
      (id) => id.toString() === roomId
    );
    if (room === -1) throw new NotFoundError("Room not found in favourites");
    user.favouriteRooms.splice(room, 1);
    await user.save();
    return user;
  }
  async getReservationsBetweenDates(checkIn, checkOut) {
    return await Reservation.find({
      $and: [
        {
          $or: [
            {
              checkIn: { $lte: checkIn },
              checkOut: { $gte: checkIn },
            },
            {
              checkIn: { $lte: checkOut },
              checkOut: { $gte: checkOut },
            },
            {
              checkIn: { $gte: checkIn },
              checkOut: { $lte: checkOut },
            },
            {
              checkIn: { $lte: checkIn },
              checkOut: { $gte: checkOut },
            },
          ],
        },
        { status: { $ne: "663a8158e3427acea0ef0b54" } },
      ],
    });
  }
}

module.exports = roomRepository;
