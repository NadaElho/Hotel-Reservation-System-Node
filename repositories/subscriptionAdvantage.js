const NotFoundError = require("../handleErrors/notFoundError");
const SubscriptionAdvantage = require("../models/subscriptionAdvantage");
class SubscriptionAdvantageRepository {
  async getAllSubscriptionsAdvantage(skip, limit) {
    const documentCount = await SubscriptionAdvantage.countDocuments();
    const data = await SubscriptionAdvantage.find().skip(skip).limit(limit);
    if (!data.length) {
      throw new NotFoundError("No Subscription Advantage found");
    }
    return { data, documentCount };
  }

  async getSubscriptionAdvantageById(id) {
    const subscriptionAdvantage = await SubscriptionAdvantage.findOne(id);
    if (!subscriptionAdvantage) {
      throw new NotFoundError(
        "The Subscription Advantage with this ID was not found"
      );
    }
    return subscriptionAdvantage;
  }

  async addSubscriptionAdvantage(req) {
    return await SubscriptionAdvantage.create(req);
  }

  async editSubscriptionAdvantage(id, req) {
    return await SubscriptionAdvantage.updateOne(id, req);
  }

  async deleteSubscriptionAdvantage(id) {
    return await SubscriptionAdvantage.deleteOne(id);
  }
}

module.exports = SubscriptionAdvantageRepository;
