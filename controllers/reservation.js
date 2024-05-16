const Reservation = require('../models/reservation')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

var cron = require('node-cron')
const BadRequestError = require('../utils/badRequestError')

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
    return await this.reservationRepository.addNewReservation(body)
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
    return await this.reservationRepository.editReservation(id, body)
  }

  async cancelReservation(id) {
    return await this.reservationRepository.cancelReservation(id)
  }

  async payWithStripe(req, id) {
    const reservation = await this.reservationRepository.getReservation(id)

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
