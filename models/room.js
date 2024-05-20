const { mongoose } = require('mongoose')
const roomSchema = mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Rome must have Hotel Id'],
  },
  roomNumber: {
    type: Number,
    required: [true, 'Room must have Room Number'],
    unique: [true, 'Room number must be unique']
  },
  description_en: {
    type: String,
    required: [true, 'Room must have Description'],
  },
  description_ar: {
    type: String,
    required: [true, 'Room must have Description'],
  },
  amentiesIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Amenty',
    },
  ],
  roomTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType',
    required: [true, ' Room must have Room Type Id'],
  },
  price: {
    type: Number,
    required: [true, 'Room must have Price'],
  },
  currency: {
    type: String,
    required: [true, 'Room must have currency'],
  },
  images: [
    {
      type: String,
      required: [true, 'Room must have Image'],
    },
  ],
})

const Room = mongoose.model('Room', roomSchema)
module.exports = Room
