const Reservation = require('../models/reservation.model')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

class reservationRepository {
  async getAllReservations() {
    const reservations = await Reservation.find()
      .populate('roomId')
      .populate('status')
    return reservations
  }

  async getUserReservations(userId) {
    const userReservations = await Reservation.find({ userId })
      .populate('roomId')
      .populate('status')
    return userReservations
  }

  async getReservation(id) {
    const reservation = await Reservation.findOne({ _id: id })
      .populate('roomId')
      .populate('status')
    return reservation
  }

  async getRoomReservations(roomId) {
    const roomReservations = await Reservation.find({ roomId })
      .populate('roomId')
      .populate('status')
    return roomReservations
  }

  async addNewReservation({
    userId,
    roomId,
    status,
    checkIn,
    checkOut,
    totalPrice,
    noOfNights,
  }) {
    await Reservation.create({
      userId,
      roomId,
      status,
      checkIn,
      checkOut,
      totalPrice,
      noOfNights,
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
        { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } },
        { checkIn: { $lte: checkIn }, checkOut: { $gte: checkOut } },
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
