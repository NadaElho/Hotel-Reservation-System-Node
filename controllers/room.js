const Reservation = require("../models/reservation")

class RoomController {
  constructor(roomRepository) {
    this.roomRepository = roomRepository
  }

  async addRoom(newRoom) {
    return await this.roomRepository.addRoom(newRoom)
  }

  async getAllRooms(query, sortBy, skip, limit) {
    return await this.roomRepository.getAllRooms(query, sortBy, skip, limit)
  }

  async getRoomById(roomId) {
    return await this.roomRepository.getRoomById(roomId)
  }

  async editRoom(id, updateRoom) {
    return await this.roomRepository.editRoom(id, updateRoom)
  }

  async deleteRoom(id) {
    return await this.roomRepository.deleteRoom(id)
  }

  async getReservationsBetweenDates(checkIn, checkOut) {
    return await this.roomRepository.getReservationsBetweenDates(
      checkIn,
      checkOut,
    )
  }

  async getNotAvailableDays(roomId) {
    const roomReservations = await Reservation.find({ roomId })
    let notAvailableDays = []

    roomReservations.forEach((reservation) => {
      let currentDate = new Date(reservation.checkIn)
      const checkoutDate = new Date(reservation.checkOut)

      while (currentDate < checkoutDate) {
        notAvailableDays.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })
    return notAvailableDays
  }
}

module.exports = RoomController
