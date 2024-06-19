const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
  title: {
    type: String,
    reuired: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Room" ,
    required: true
  },
  date:{
    type: Date,
    default: Date.now,
  }
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review
