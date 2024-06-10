const Promotion = require("../models/promotion");

class PromotionRepository {
  async getAllPromotions() {
    return await Promotion.find();
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
