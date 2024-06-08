
const NotFoundError = require('../handleErrors/notFoundError')
const Subscription = require('../models/subscription')

class SubscriptionRepository {
  async getAllSubscriptions() {
    const subscription = await Subscription.find().populate('subscriptionAdvantageIds')
    if (!subscription.length ) {
      throw new NotFoundError('No Subscription  found')
    }
    return subscription 
  }

  async getSubscriptionById(id) {
    const subscription  = await Subscription.findOne(id)
    if (!subscription ) {
      throw new NotFoundError('The Subscription with this ID was not found')
    }
    return subscription 
  }

  async addSubscription(req) {
    return await Subscription.create(req)
  }

  async editSubscription(id, req) {
    return await Subscription.updateOne(id, req)
  }

  async deleteSubscription(id) {
    return await Subscription.deleteOne(id)
  }
}

module.exports = SubscriptionRepository
