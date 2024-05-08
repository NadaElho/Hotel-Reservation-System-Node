const mongoose = require('mongoose')

const reservationStatusSchema = mongoose.Schema({
    name_en:{
        type: String,
        required: true
    },
    name_ar:{
        type: String,
        required: true
    }
})

const ReservationStatus = mongoose.model('ReservationStatus', reservationStatusSchema)
module.exports = ReservationStatus 