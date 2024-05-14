const express = require('express')
const { protect, restrictTo } = require('../middleware/auth')
const router = express.Router()

const roomTypeRouter = (roomTypeController) => {
  router.get('/',roomTypeController.getAllRoomsType)
  
  router.post('/',protect, restrictTo('admin'),roomTypeController.addRoomType)

  router.patch('/:id',protect, restrictTo('admin'),roomTypeController.editRoomType)

  router.delete('/:id',protect, restrictTo('admin'),roomTypeController.deleteRoomType)

  return router
}

module.exports = roomTypeRouter
