const NotFoundError = require("../handleErrors/notFoundError");
const Promotion = require("../models/promotion");

class PromotionRepository {
  async getAllPromotions(skip,limit) {
    const documentCount = await Promotion.countDocuments();
    const data = await Promotion.find().skip(skip).limit(limit);
    //TODO:

    if (!data.length) {
      throw new NotFoundError("No Promotion found");
    }
    return { data, documentCount };
  }

  async getPromotionById(id) {
    return await Promotion.findOne({ _id: id });
  }

  async addPromotion(newPromotion) {
    return await Promotion.create(newPromotion);
  }

  async editPromotion(id, body) {
    return await Promotion.updateOne({ _id: id }, body);
  }

  async deletePromotion(id) {
    return await Promotion.deleteOne({ _id: id });
  }
}
module.exports = PromotionRepository;
