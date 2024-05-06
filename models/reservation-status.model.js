const mongoose = require('mongoose')

const reservationStatusSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

const ReservationStatus = mongoose.model('ReservationStatus', reservationStatusSchema)
module.exports = ReservationStatus 