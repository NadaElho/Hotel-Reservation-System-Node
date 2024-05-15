const Reservation = require('../models/reservation.model')
const Room = require('../models/room')
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

var cron = require('node-cron');
const User = require('../models/user.model');

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
    return this.reservationRepository.addNewReservation(body)
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
    return this.reservationRepository.editReservation(id, body)
  }

  cancelReservation(id) {
    return this.reservationRepository.cancelReservation(id)
  }


  async payWithStripe(req, id){
    const reservation = await this.reservationRepository.getReservation(id)

    if(!reservation._id){
        return {message: `No reservation with this id ${id}`}
    }

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
        success_url: `${req.protocol}://${req.get('host')}/reservations?success=true`,
        cancel_url: `${req.protocol}://${req.get('host')}/reservations?canceled=true`,
        customer_email: reservation.userId.email,
      })
      return session
  }
}

module.exports = reservationController
