class SubscriptionController {
    constructor(subscriptionRepository) {
      this.subscriptionRepository = subscriptionRepository
    }
  
    async getAllSubscriptions() {
      return await this.subscriptionRepository.getAllSubscriptions()
    }
  
    async getSubscriptionById(id) {
      return await this.subscriptionRepository.getSubscriptionById(id)
    }
  
    async addSubscription(newSubscription) {
      return await this.subscriptionRepository.addSubscription(newSubscription)
    }
  
    async editSubscription(id, UpdateSubscription) {
      return await this.subscriptionRepository.editSubscription(id, UpdateSubscription)
    }
  
    async deleteSubscription(id) {
      return await this.subscriptionRepository.deleteSubscription(id)
    }
  }
  
  module.exports = SubscriptionController
  