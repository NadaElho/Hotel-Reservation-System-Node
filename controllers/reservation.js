const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const BadRequestError = require('../handleErrors/badRequestError')
const Room = require('../models/room')
const Reservation = require('../models/reservation')
var cron = require('node-cron')

class ReservationController {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository
  }

  schedule(){
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
  }
  
  async getAllReservations(skip,limit) {
    return await this.reservationRepository.getAllReservations(skip,limit)
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
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
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
      success_url: `http://localhost:5173/payment-result?success=true&total=${reservation.totalPrice}`,
      cancel_url: `http://localhost:5173/payment-result?canceled=true`,
      customer_email: reservation.userId.email,
    })
    return session
  }
}

module.exports = ReservationController
