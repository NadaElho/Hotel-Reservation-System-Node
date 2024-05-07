const express = require('express')
const router = express.Router()

const roomRouter = (roomController) => {
  router.get('/',roomController.getAllRooms)

  router.get('/:id',roomController.getRoomById)

  router.post('/',roomController.addRoom)

  router.patch('/:id',roomController.editRoom)

  router.delete('/:id',roomController.deleteRoom)

  return router
}

module.exports = roomRouter
