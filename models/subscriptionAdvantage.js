// SubscriptionAdvantage
const mongoose = require('mongoose')
const subscriptionAdvantageSchema = mongoose.Schema({
  name_en: {
    type: String,
    required: [true, 'Name in English is required'],
  },
  name_ar: {
    type: String,
    required: [true, 'Name in Arabic is required'],
  },
})

const SubscriptionAdvantage = mongoose.model('subscriptionAdvantage', subscriptionAdvantageSchema)
module.exports = SubscriptionAdvantage
