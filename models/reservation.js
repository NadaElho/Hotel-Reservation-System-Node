const mongoose = require('mongoose')

const reservationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room id is required'],
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReservationStatus',
    required: [true, 'Status id is required'],
  },
  checkIn: {
    type: Date,
    required: [true, 'Check in date is required'],
  },
  checkOut: {
    type: Date,
    required: [true, 'Check out date is required'],
  },
  totalPrice: {
    type: Number,
  },
  paid:{
    type: Boolean,
    default: false
  }
})

const Reservation = mongoose.model('Reservation', reservationSchema)
module.exports = Reservation
