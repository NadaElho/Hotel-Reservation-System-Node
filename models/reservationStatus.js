const mongoose = require('mongoose')

const reservationStatusSchema = mongoose.Schema({
  name_en: {
    type: String,
    required: [true, 'Name in English is required'],
  },
  name_ar: {
    type: String,
    required: [true, 'Name in Arabic is required'],
  },
})

const ReservationStatus = mongoose.model(
  'ReservationStatus',
  reservationStatusSchema,
)
module.exports = ReservationStatus
