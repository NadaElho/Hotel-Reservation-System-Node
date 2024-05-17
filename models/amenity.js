const mongoose = require('mongoose')

const amenitySchema = mongoose.Schema({
  name_ar: {
    type: String,
    required: true,
  },
  name_en: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
})

const amenity = mongoose.model('Amenity', amenitySchema)
module.exports = amenity
