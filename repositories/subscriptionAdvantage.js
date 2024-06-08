
const NotFoundError = require('../handleErrors/notFoundError')
const SubscriptionAdvantage = require('../models/subscriptionAdvantage')
class SubscriptionAdvantageRepository {
  async getAllSubscriptionsAdvantage() {
    const subscriptionAdvantage = await SubscriptionAdvantage.find()
    if (!subscriptionAdvantage.length ) {
      throw new NotFoundError('No Subscription Advantage found')
    }
    return subscriptionAdvantage 
  }

  async getSubscriptionAdvantageById(id) {
    const subscriptionAdvantage  = await SubscriptionAdvantage.findOne(id)
    if (!subscriptionAdvantage ) {
      throw new NotFoundError('The Subscription Advantage with this ID was not found')
    }
    return subscriptionAdvantage 
  }

  async addSubscriptionAdvantage(req) {
    return await SubscriptionAdvantage.create(req)
  }

  async editSubscriptionAdvantage(id, req) {
    return await SubscriptionAdvantage.updateOne(id, req)
  }

  async deleteSubscriptionAdvantage(id) {
    return await SubscriptionAdvantage.deleteOne(id)
  }
}

module.exports = SubscriptionAdvantageRepository
