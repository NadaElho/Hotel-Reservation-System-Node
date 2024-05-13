const Reservation = require('../models/reservation.model')

class reservationRepository {
  async getAllReservations() {
    const reservations = await Reservation.find()
      .populate('roomId')
      .populate('status')
      .popuate('userId')
    return reservations
  }

  async getUserReservations(userId) {
    const userReservations = await Reservation.find({ userId })
      .populate('roomId')
      .populate('status')
      .popuate('userId')
    return userReservations
  }

  async getReservation(id) {
    const reservation = await Reservation.findOne({ _id: id })
      .populate('roomId')
      .populate('status')
      .popuate('userId')
    return reservation
  }

  async getRoomReservations(roomId) {
    const roomReservations = await Reservation.find({ roomId })
      .populate('roomId')
      .populate('status')
      .popuate('userId')
    return roomReservations
  }

  async addNewReservation({
    userId,
    roomId,
    status,
    checkIn,
    checkOut,
    totalPrice,
  }) {
    await Reservation.create({
      userId,
      roomId,
      status,
      checkIn,
      checkOut,
      totalPrice,
    })
  }

  async editReservation(id, { checkIn, checkOut }) {
    await Reservation.updateOne({ _id: id }, { checkIn, checkOut })
  }

  async cancelReservation(id) {
    await Reservation.updateOne(
      { _id: id },
      { $set: { status: '663a8158e3427acea0ef0b54' } },
    )
  }

  async payWithStripe(id) {
    const reservation = await Reservation.findOne({ _id: id }).populate(
      'roomId',
    )
    return reservation
  }

  async isRoomReserved(roomId, checkIn, checkOut, id) {
    const getRoomReservations = await Reservation.find({
      roomId,
      $or: [
     
      ],
    }).populate('status')
    const reservationsExceptEditing = getRoomReservations.filter(
      (reservation) => {
        return reservation.id != id && reservation.status.name_en != 'canceled'
      },
    )
    return reservationsExceptEditing.length
  }
}

module.exports = reservationRepository
