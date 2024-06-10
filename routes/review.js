const express = require('express')
const { protect } = require('../middlewares/auth')
const router = express.Router()

const reviewRouter = (reviewController) => {
  router.get('/', protect, async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
    
      const { reviews, documentCount } = await reviewController.getReviews(skip, limit)

      const pagination = {
        currentPage: page,
        limit,
        numberPages: Math.ceil(documentCount / limit),
        documentCount,
      };
      if (endIndex < documentCount) {
        pagination.nextPage = page + 1;
      }

      if (skip > 0) {
        pagination.prevPage = page - 1;
      }
      res.status(200).json({ pagination: pagination, data: reviews })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.get('/:roomId', protect, async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
    
      const { reviews, documentCount } = await reviewController.getRoomReviews(req.params.roomId)

      const pagination = {
        currentPage: page,
        limit,
        numberPages: Math.ceil(documentCount / limit),
        documentCount,
      };
      if (endIndex < documentCount) {
        pagination.nextPage = page + 1;
      }

      if (skip > 0) {
        pagination.prevPage = page - 1;
      }
      res.status(200).json({ pagination: pagination, data: reviews })
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
