// Subscription
const mongoose = require('mongoose')
const subscriptionSchema = mongoose.Schema({
  name_en: {
    type: String,
    required: [true, 'Name in English is required'],
  },
  name_ar: {
    type: String,
    required: [true, 'Name in Arabic is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  currency: {
    type: String,
    default:'$',
  },
  percentage: {
    type: Number,
    required: [true, 'Percentage is required'],
  },
  subscriptionAdvantageIds:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subscriptionAdvantage',
    required: [true, 'subscription Advantage Id is required'],
  },]
})


const Subscription = mongoose.model('Subscription', subscriptionSchema)
module.exports = Subscription
