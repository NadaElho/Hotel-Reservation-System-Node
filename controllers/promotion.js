class PromotionController {
  constructor(promotionRepository) {
    this.promotionRepository = promotionRepository;
  }
  async getAllPromotions(skip, limit) {
    return await this.promotionRepository.getAllPromotions(skip, limit);
  }

  async getPromotionById(id) {
    return await this.promotionRepository.getPromotionById(id);
  }

  async addPromotion(newPromotion) {
    return await this.promotionRepository.addPromotion(newPromotion);
  }

  async editPromotion(id, body) {
    return await this.promotionRepository.editPromotion(id, body);
  }

  async deletePromotion(id) {
    return await this.promotionRepository.deletePromotion(id);
  }
}
module.exports = PromotionController;
