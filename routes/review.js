const express = require('express')
const { protect } = require('../middlewares/auth')
const router = express.Router()

const reviewRouter = (reviewController) => {
  router.get('/', protect, async (req, res) => {
    try {
      const getAllReviews = await reviewController.getReviews()
      res.status(200).json({ data: getAllReviews })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.post('/', protect, async (req, res) => {
    try {
      await reviewController.addReview(req.body)
      res.status(201).json({ data: req.body })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.patch('/:id', protect, async (req, res) => {
    try {
      await reviewController.editReview(req.params.id, req.body)
      res.status(200).json({ data: req.body })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.delete('/:id', protect, async (req, res) => {
    try {
      await reviewController.deleteReview(req.params.id)
      res
        .status(200)
        .json({ message: 'Review deleted successfully' })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  return router
}

module.exports = reviewRouter
