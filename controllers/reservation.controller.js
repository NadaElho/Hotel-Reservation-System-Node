const Reservation = require('../models/reservation.model')
const Room = require('../models/room.model')
var cron = require('node-cron')

cron.schedule('0 0 * * *', async () => {
  //MIN H D MON DWeek
  const allResevations = await Reservation.find()
  let todayDate = new Date()
  allResevations.forEach(async (reservation) => {
    if (todayDate >= reservation.checkOut) {
      await Reservation.updateOne(
        { _id: reservation.id },
        { $set: { status: '663a81a4e3427acea0ef0b58' } },
      )
    }
  })
})

class reservationController {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository
  }

  getAllReservations() {
    return this.reservationRepository.getAllReservations()
  }

  getUserReservations(userId) {
    return this.reservationRepository.getUserReservations(userId)
  }

  getRoomReservations(roomId) {
    return this.reservationRepository.getRoomReservations(roomId)
  }

  getReservation(id) {
    return this.reservationRepository.getReservation(id)
  }

  async addNewReservation(body) {
    const { roomId, checkIn, checkOut } = body
    if (
      await this.reservationRepository.isRoomReserved(roomId, checkIn, checkOut)
    ) {
      return { message: 'Room is already reserved' }
    }
    const differenceBetweenDays =
      new Date(body.checkOut).getTime() - new Date(body.checkIn).getTime()
    const calcNoOfNights =
      Math.round(differenceBetweenDays) / (1000 * 3600 * 24)
    const room = await Room.findOne({ _id: body.roomId })
    const calcTotalPrice = calcNoOfNights * room.price
    const newBody = {
      ...body,
      totalPrice: calcTotalPrice,
      noOfNights: calcNoOfNights,
    }
    return this.reservationRepository.addNewReservation(newBody)
  }

  async editReservation(id, body) {
    const { roomId, checkIn, checkOut } = body
    if (
      await this.reservationRepository.isRoomReserved(
        roomId,
        checkIn,
        checkOut,
        id,
      )
    ) {
      return { message: 'Room is already reserved' }
    }
    const differenceBetweenDays =
      new Date(body.checkOut).getTime() - new Date(body.checkIn).getTime()
    const calcNoOfNights =
      Math.round(differenceBetweenDays) / (1000 * 3600 * 24)
    const room = await Room.findOne({ _id: body.roomId })
    const calcTotalPrice = calcNoOfNights * room.price
    const newBody = {
      ...body,
      totalPrice: calcTotalPrice,
      noOfNights: calcNoOfNights,
    }
    return this.reservationRepository.editReservation(id, newBody)
  }

  cancelReservation(id) {
    return this.reservationRepository.cancelReservation(id)
  }
}

module.exports = reservationController
