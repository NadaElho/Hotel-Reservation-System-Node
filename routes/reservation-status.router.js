const express = require('express')
const router = express.Router()

const reservationSatusRouter = (reservationSatusController) => {
  router.get('/', async (req, res) => {
    try {
      res
        .status(200)
        .send(await reservationSatusController.getReservationStatus())
    } catch (err) {
      res.status(404).send('No reservation status found')
    }
  })

  router.post('/', (req, res) => {
    try {
      reservationSatusController.addReservationStatus(req.body)
      res.status(201).send('Reservation status added successfully')
    } catch (err) {
      res.status(404).send('Error happened')
    }
  })

  router.patch('/:id', (req, res) => {
    try {
      reservationSatusController.editReservationStatus(req.params.id, req.body)
      res.status(200).send('Reservation status updated successfully')
    } catch (err) {
      res.status(404).send('Error happened')
    }
  })

  router.delete('/:id', (req, res) => {
    try {
      reservationSatusController.deleteReservationStatus(req.params.id)
      res.status(200).send('Reservation status deleted successfully')
    } catch (err) {
      res.status(404).send('Error happened')
    }
  })

  return router
}

module.exports = reservationSatusRouter
