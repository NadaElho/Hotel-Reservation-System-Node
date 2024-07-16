const BadRequestError = require("../handleErrors/badRequestError");
const NotFoundError = require("../handleErrors/notFoundError");
const Role = require("../models/role");
const Subscription = require("../models/subscription");
const User = require("../models/user");

class UserRepository {
  async getAllUsers(skip, limit) {
    const documentCount = await User.countDocuments();
    const data = await User.find()
      .populate("role")
      .populate("subscriptionId")
      .skip(skip)
      .limit(limit);
    //TODO:
    if (!data || data.length === 0) {
      throw new NotFoundError("No users found");
    }

    return { data, documentCount };
  }

  async getUserById(id) {
    const user = await User.findOne({ _id: id })
      .populate("role")
      .populate("subscriptionId")
      .populate({
        path: "favouriteRooms",
        model: "Room",
        populate: {
          path: "promotionId",
          model: "Promotion",
        },
      })
      .populate({
        path: "favouriteRooms",
        model: "Room",
        populate: {
          path: "hotelId",
          model: "Hotel",
        },
      })
      .populate({
        path: "favouriteRooms",
        model: "Room",
        populate: {
          path: "roomTypeId",
          model: "RoomType",
        },
      });

    if (!user) {
      throw new NotFoundError("The user with this ID was not found");
    }
    return user;
  }
  async getRoleById(id) {
    const role = await Role.findOne({ _id: id });
    if (!role) {
      throw new NotFoundError("This Role ID was not found");
    }
    return role;
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
    if (userId.subscriptionId == subscriptionId) {
      throw new BadRequestError("You are subscribed in the same plan");
    }
    userId.subscriptionId = subscriptionId;
    await userId.save();
    return userId;
  }

  async deleteSubscriptionToUser(userId) {
    if (!userId.subscriptionId) {
      throw new NotFoundError("The Subscription with this ID was not found");
    }
    const subscriptionId = userId.subscriptionId.toString();
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
    });
    if (!subscription) {
      throw new NotFoundError("The Subscription with this ID was not found");
    }
    userId.subscriptionId = null;
    await userId.save();
    return userId;
  }
}

module.exports = UserRepository;
