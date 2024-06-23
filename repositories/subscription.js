const NotFoundError = require("../handleErrors/notFoundError");
const Subscription = require("../models/subscription");
const User = require("../models/user");

class SubscriptionRepository {
  async getAllSubscriptions(skip, limit) {
    const documentCount = await Subscription.countDocuments();
    const data = await Subscription.find()
      .populate("subscriptionAdvantageIds")
      .skip(skip)
      .limit(limit);

    if (!data.length) {
      throw new NotFoundError("No Subscription  found");
    }
    return { data, documentCount };
  }

  async getSubscriptionById(id) {
    const subscription = await Subscription.findOne({ _id: id });
    if (!subscription) {
      throw new NotFoundError("The Subscription with this ID was not found");
    }

    return subscription;
  }

  async addSubscription(req) {
    // const user = await User.findById(userId._id);
    const subscription = await Subscription.create(req);
    // userId.subscriptionId = subscription._id;
    // await userId.save();
    return subscription;
  }

  async editSubscription(id, req) {
    return await Subscription.updateOne(id, req);
  }

  async deleteSubscription(id) {
    return await Subscription.deleteOne(id);
  }

  async payWithStripe(id) {
    const subscription = await Subscription.findOne({ _id: id })
    return subscription;
  }
}

module.exports = SubscriptionRepository;
