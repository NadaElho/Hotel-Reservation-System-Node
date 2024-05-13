const express = require('express')
const { protect, restrictTo } = require('../controllers/auth.controller')
const router = express.Router()

const roomTypeRouter = (roomTypeController) => {
  router.get('/',roomTypeController.getAllRoomsType)
  
  router.post('/',protect, restrictTo('admin'),roomTypeController.addRoomType)

  router.patch('/:id',protect, restrictTo('admin'),roomTypeController.editRoomType)

  router.delete('/:id',protect, restrictTo('admin'),roomTypeController.deleteRoomType)

  // router.post('/',roomTypeController.addRoomType)
  // router.patch('/:id',roomTypeController.editRoomType)
  // router.delete('/:id',roomTypeController.deleteRoomType)

  return router
}

module.exports = roomTypeRouter
