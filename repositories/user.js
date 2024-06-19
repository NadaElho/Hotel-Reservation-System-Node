const Subscription = require("../models/subscription");
const User = require("../models/user");

class UserRepository {
  async getAllUsers(skip, limit) {
    const documentCount = await User.countDocuments();
    const data = await User.find().populate("role").skip(skip).limit(limit);
    //TODO:
    if (!data || data.length === 0) {
      throw new NotFoundError("No users found");
    }

    return { data, documentCount };
  }

  async getUserById(id) {
    return await User.findOne({ _id: id }).populate("role");
  }

  async updateUser(id, body) {
    return await User.updateOne({ _id: id }, body);
  }

  async updaeUserPassword(id, password) {
    return await User.updateOne({ _id: id }, { password });
  }

  async deleteUser(id) {
    return await User.deleteOne({ _id: id });
  }
  async addSubscriptionToUser(subscriptionId, userId) {
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
    });
    if (!subscription) {
      throw new NotFoundError("The Subscription with this ID was not found");
    }
    userId.subscriptionId = subscriptionId;
    await userId.save();
    return userId;
  }
}

module.exports = UserRepository;
