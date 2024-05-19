const mongoose = require('mongoose')

const hotelSchema = mongoose.Schema({
  name_ar: {
    type: String,
    required: true,
  },
  name_en: {
    type: String,
    required: true,
  },
  address_ar: {
    type: String,
    required: true,
  },
  address_en: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  description_ar: {
    type: String,
    required: true,
  },
  description_en: {
    type: String,
    required: true,
  },
  phoneNumber: [{
    type: [String],
    required: true,
  }],
})

const hotel = mongoose.model('Hotel', hotelSchema)
module.exports = hotel
