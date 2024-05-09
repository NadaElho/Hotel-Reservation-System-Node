const express = require('express')
const router = express.Router()

const roomTypeRouter = (roomTypeController) => {
  router.get('/',roomTypeController.getAllRoomsType)
  
  router.post('/',roomTypeController.addRoomType)

  router.patch('/:id',roomTypeController.editRoomType)

  router.delete('/:id',roomTypeController.deleteRoomType)

  return router
}

module.exports = roomTypeRouter
