const mongoose = require('mongoose')
const roomTypeSchema = mongoose.Schema({
  type_en: {
    type: String,
    required: [true, 'RoomType  must have Type'],
  },
  type_ar: {
    type: String,
    required: [true, 'RoomType  must have Type'],
  },
})

const RoomType = mongoose.model('RoomType', roomTypeSchema)
module.exports = RoomType
