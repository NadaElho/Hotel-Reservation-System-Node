const express = require('express')
const { protect, restrictTo } = require('../middlewares/auth')
const router = express.Router()

const reservationRouter = (reservationController) => {
  router.get('/', protect, restrictTo('admin'), async (req, res) => {
    try {
      const allReservations = await reservationController.getAllReservations()
      res.status(200).json({ data: allReservations })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.get('/:userId', protect, async (req, res) => {
    try {
      const userReservations = await reservationController.getUserReservations(
        req.params.userId,
      )
      res.status(200).json({ data: userReservations })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.get(
    '/room/:roomId',
    protect,
    restrictTo('admin'),
    async (req, res) => {
      try {
        const roomReservations = await reservationController.getRoomReservations(
          req.params.roomId,
        )
        res.status(200).json({ data: roomReservations })
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
      }
    },
  )

  router.get('/reservation/:id', protect, async (req, res) => {
    try {
      const reservation = await reservationController.getReservation(
        req.params.id,
      )
      res.status(200).json({ data: reservation })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.post('/', protect, async (req, res) => {
    try {
      await reservationController.addNewReservation(req.body)
      res.status(201).json({ data: req.body })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.patch('/:id', protect, async (req, res) => {
    try {
      await reservationController.editReservation(req.params.id, req.body)
      res.status(200).json({ data: req.body })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.patch('/:id/cancel', protect, async (req, res) => {
    try {
      await reservationController.cancelReservation(req.params.id)
      res.status(200).json({ message: 'Reservation canceled' })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.post('/:id/payment', protect, async (req, res) => {
    try {
      await reservationController.payWithStripe(req, req.params.id)
      res.status(200).json({ status: 'success', session: response })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  return router
}

module.exports = reservationRouter
