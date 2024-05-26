const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const BadRequestError = require('../handleErrors/badRequestError')
const Room = require('../models/room')

class ReservationController {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository
  }

  async getAllReservations() {
    return await this.reservationRepository.getAllReservations()
  }

  async getUserReservations(userId) {
    return await this.reservationRepository.getUserReservations(userId)
  }

  async getRoomReservations(roomId) {
    return await this.reservationRepository.getRoomReservations(roomId)
  }

  async getReservation(id) {
    return await this.reservationRepository.getReservation(id)
  }

  async addNewReservation(body) {
    const { roomId, checkIn, checkOut } = body
    if (
      await this.reservationRepository.isRoomReserved(roomId, checkIn, checkOut)
    ) {
      throw new BadRequestError('This room already reserved')
    }
    const differenceBetweenDays =
      new Date(body.checkOut).getTime() - new Date(body.checkIn).getTime()
    const calcNoOfNights =
      Math.round(differenceBetweenDays) / (1000 * 3600 * 24)
    const room = await Room.findOne({ _id: body.roomId })
    const calcTotalPrice = calcNoOfNights * room.price
    return await this.reservationRepository.addNewReservation({
      ...body,
      totalPrice: calcTotalPrice,
    })
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
      throw new BadRequestError('This room already reserved')
    }
    const differenceBetweenDays =
      new Date(body.checkOut).getTime() - new Date(body.checkIn).getTime()
    const calcNoOfNights =
      Math.round(differenceBetweenDays) / (1000 * 3600 * 24)
    const room = await Room.findOne({ _id: body.roomId })
    const calcTotalPrice = calcNoOfNights * room.price
    return await this.reservationRepository.editReservation(id, {
      ...body,
      calcTotalPrice,
    })
  }

  async cancelReservation(id) {
    return await this.reservationRepository.cancelReservation(id)
  }

  async payWithStripe(req, id) {
    const reservation = await this.reservationRepository.getReservation(id)
console.log(reservation.roomId.roomNumber);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'egp',
            unit_amount: reservation.totalPrice * 100,
            product_data: {
              name: `Room Number: ${reservation.roomId.roomNumber}`,
              description: reservation.roomId.description,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get(
        'host',
      )}/reservations?success=true`,
      cancel_url: `${req.protocol}://${req.get(
        'host',
      )}/reservations?canceled=true`,
      customer_email: reservation.userId.email,
    })
    return session
  }
}

module.exports = ReservationController
