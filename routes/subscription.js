const express = require('express')
const { protect, restrictTo } = require('../middlewares/auth')
const {
  validateNewSubscription,
  validateUpdateSubscription,
} = require('../validations/subscription')
const BadRequestError = require('../handleErrors/badRequestError')
const router = express.Router()

const subscriptionRouter = (subscriptionController) => {
  router.get('/', protect, restrictTo('admin'),async (req, res) => {
    try {
      const subscriptions = await subscriptionController.getAllSubscriptions()
      res.status(200).json({
        status: 'success',
        data: subscriptions,
      })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })
  router.post('/', protect,async (req, res) => {
    try {
      const { error } = validateNewSubscription(req.body)
      if (error) {
        throw new BadRequestError(error.message)
      }
      const subscription = await subscriptionController.addSubscription({
        ...req.body,
      })
      res.status(201).json({
        status: 'success',
        message: 'Subscription  added successfully',
        subscription: subscription,
      })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })
  router.patch('/:id', protect, async (req, res) => {
    try {
      const { id } = req.params
      const room = await subscriptionController.getSubscriptionById({ _id: id })
      const { error } = validateUpdateSubscription(req.body)
      if (error) {
        throw new BadRequestError(error.message)
      }
      const updatesubscription = await subscriptionController.editSubscription(
        { _id: id },
        { ...req.body },
      )

      const findNewSubscription = await subscriptionController.getSubscriptionById({
        _id: id,
      })
      res.status(200).json({
        status: 'success',
        message: 'Subscription  updated successfully',
        subscription: findNewSubscription,
      })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })
  router.delete('/:id', protect, async (req, res) => {
    try {
      const { id } = req.params
      const room = await subscriptionController.getSubscriptionById({ _id: id })

      if (!room) {
        res.status(404).json('Subscription  not found')
        return
      }
      await subscriptionController.deleteSubscription({ _id: id })

      res.status(200).json({
        status: 'success',
        message: 'Subscription  deleted successfully',
      })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  return router
}

module.exports = subscriptionRouter
