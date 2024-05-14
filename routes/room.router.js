const express = require('express')
const { uploadMultiple } = require('../middleware/multer')
const { uploadImage } = require('../middleware/firebase')
const { protect, restrictTo } = require('../middleware/auth')
const router = express.Router()
//router
const roomRouter = (roomController) => {
  router.get('/',roomController.getAllRooms)

  router.get('/:id',roomController.getRoomById)

  router.post('/',protect, restrictTo('admin'),uploadMultiple,uploadImage,roomController.addRoom)
  router.patch('/:id',protect, restrictTo('admin'),uploadMultiple,uploadImage,roomController.editRoom)
  router.delete('/:id',protect, restrictTo('admin'),roomController.deleteRoom)

  return router
}

module.exports = roomRouter
