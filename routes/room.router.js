const express = require('express')
const { uploadMultiple } = require('../middleware/multer')
const { uploadImage } = require('../middleware/firebase')
const router = express.Router()
//router
const roomRouter = (roomController) => {
  router.get('/',roomController.getAllRooms)

  router.get('/:id',roomController.getRoomById)

  router.post('/',uploadMultiple,uploadImage,roomController.addRoom)
  
  router.patch('/:id',uploadMultiple,uploadImage,roomController.editRoom)

  router.delete('/:id',roomController.deleteRoom)

  return router
}

module.exports = roomRouter
