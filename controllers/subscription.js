const User = require('../models/user');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

class SubscriptionController {
  constructor(subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async getAllSubscriptions(skip, limit) {
    return await this.subscriptionRepository.getAllSubscriptions(skip, limit);
  }

  async getSubscriptionById(id) {
    return await this.subscriptionRepository.getSubscriptionById(id);
  }

  async addSubscription(newSubscription) {
    return await this.subscriptionRepository.addSubscription(newSubscription);
  }

  async editSubscription(id, UpdateSubscription) {
    return await this.subscriptionRepository.editSubscription(
      id,
      UpdateSubscription
    );
  }

  async deleteSubscription(id) {
    return await this.subscriptionRepository.deleteSubscription(id);
  }

  async payWithStripe(req, id) {
    const user = await User.findById(req.body.user)
    const subscription = await this.subscriptionRepository.getSubscriptionById(id)
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: subscription.price * 100,
            product_data: {
              name: `Subscription plan: ${subscription.name_en}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/payment-result?success=true&total=${subscription.price}`,
      cancel_url: `http://localhost:5173/payment-result?canceled=true`,
      customer_email: user.email,
    })
    return session
  }
}

module.exports = SubscriptionController;
