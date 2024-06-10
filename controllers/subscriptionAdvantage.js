class SubscriptionAdvantageController {
    constructor(subscriptionAdvantageRepository) {
      this.subscriptionAdvantageRepository = subscriptionAdvantageRepository
    }
  
    async getAllSubscriptionsAdvantage() {
      return await this.subscriptionAdvantageRepository.getAllSubscriptionsAdvantage()
    }
  
    async getSubscriptionAdvantageById(id) {
      return await this.subscriptionAdvantageRepository.getSubscriptionAdvantageById(id)
    }
  
    async addSubscriptionAdvantage(newSubscriptionAdvantage) {
      return await this.subscriptionAdvantageRepository.addSubscriptionAdvantage(newSubscriptionAdvantage)
    }
  
    async editSubscriptionAdvantage(id, UpdateSubscriptionAdvantage) {
      return await this.subscriptionAdvantageRepository.editSubscriptionAdvantage(id, UpdateSubscriptionAdvantage)
    }
  
    async deleteSubscriptionAdvantage(id) {
      return await this.subscriptionAdvantageRepository.deleteSubscriptionAdvantage(id)
    }
  }
  
  module.exports = SubscriptionAdvantageController
  