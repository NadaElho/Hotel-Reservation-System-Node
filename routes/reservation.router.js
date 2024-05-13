const express = require('express')
const { protect, restrictTo } = require('../controllers/auth.controller')
const router = express.Router()

const reservationRouter = (reservationController) => {
  router.get('/', protect, restrictTo('admin'), async (req, res) => {
    try {
      const allReservations = await reservationController.getAllReservations()
      if (!allReservations.length) {
        res.status(404).send(`No reservations found`)
      } else {
        res.status(200).send(allReservations)
      }
    } catch (err) {
      res.status(500).send(`Error Happened ${err}`)
    }
  })

  router.get('/:userId', protect, async (req, res) => {
    try {
      const userReservations = await reservationController.getUserReservations(
        req.params.userId,
      )
      if (!userReservations.length) {
        res.status(404).send(`No reservations for this user`)
      } else {
        res.status(200).send(userReservations)
      }
    } catch (err) {
      res.status(500).send(`Error Happened ${err}`)
    }
  })

  router.get('/room/:roomId', 9, async (req, res) => {
    try {
      const roomReservations = await reservationController.getRoomReservations(
        req.params.roomId,
      )
      if (!roomReservations.length) {
        res.status(404).send(`No reservations for this room`)
      } else {
        res.status(200).send(roomReservations)
      }
    } catch (err) {
      res.status(500).send(`Error Happened ${err}`)
    }
  })

  router.get('/reservation/:id', protect, async (req, res) => {
    try {
      const reservation = await reservationController.getReservation(
        req.params.id,
      )
      if (!reservation._id) {
        res.status(404).send(`No reservation with this id`)
      } else {
        res.status(200).send(reservation)
      }
    } catch (err) {
      res.status(500).send(`Error Happened ${err}`)
    }
  })

  router.post('/', protect, async (req, res) => {
    try {
      let response = await reservationController.addNewReservation(req.body)
      if (response?.message) {
        res.status(404).send(response.message)
      } else {
        res.status(201).send('Reservation created')
      }
    } catch (err) {
      res.status(500).send(`Error Happened ${err}`)
    }
  })

  router.patch('/:id', protect, async (req, res) => {
    try {
      let response = await reservationController.editReservation(
        req.params.id,
        req.body,
      )
      if (response?.message) {
        res.status(404).send(response.message)
      } else {
        res.status(200).send('Reservation updated')
      }
    } catch (err) {
      res.status(500).send(`Error Happened ${err}`)
    }
  })

  router.patch('/:id/cancel', protect, async (req, res) => {
    try {
      await reservationController.cancelReservation(req.params.id)
      res.status(200).send('Reservation canceled')
    } catch (err) {
      res.status(500).send(`Error Happened ${err}`)
    }
  })

  router.post('/:id/payment', protect, async (req, res) => {
    const response = await reservationController.payWithStripe(req, req.params.id)
    if(response?.message){
      res.status(404).send(response.message)
    }else{
      res.status(200).send({status: 'success', session: response})
    }
  })

  return router
}

module.exports = reservationRouter
