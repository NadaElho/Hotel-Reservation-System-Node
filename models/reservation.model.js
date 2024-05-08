const mongoose = require('mongoose')

const reservationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: [true, 'Room must have Room Number']
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReservationStatus',
        required: true
    },
    checkIn:{
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
    },
    noOfNights : {
        type: Number
    }
})

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation