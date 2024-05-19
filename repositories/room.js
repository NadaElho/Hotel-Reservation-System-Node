const Room = require('../models/room')
const NotFoundError = require('../handleErrors/notFoundError')
const Reservation = require('../models/reservation')
class roomRepository {
  async getAllRooms(query, sortBy, skip, limit) {
    const documentCount = await Room.countDocuments(query)
    const data = await Room.find(query)
      .populate('roomTypeId').populate('hotelId').populate('amenitiesIds')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)

    if (!data || data.length === 0) {
      throw new NotFoundError('No rooms found')
    }

    return { data, documentCount }
  }

  async getRoomById(id) {
    const room = await Room.findOne(id)
      .populate('amenitiesIds')
      .populate('hotelId')
      .populate('roomTypeId')

    if (!room) {
      throw new NotFoundError('The room with this ID was not found')
    }
    return room
  }

  async addRoom(req) {
    return await Room.create(req)
  }
  async editRoom(id, req) {
    return await Room.updateOne(id, req)
  }
  async deleteRoom(id) {
    return await Room.deleteOne(id)
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
        { status: { $ne: '663a8158e3427acea0ef0b54' } },
      ],
    })
  }
}

module.exports = roomRepository
