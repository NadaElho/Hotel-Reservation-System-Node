const express = require('express')
const { uploadMultiple } = require('../middlewares/multer')
const { uploadImage } = require('../middlewares/firebase')
const middleWare = require('../middlewares/auth')

const router = express.Router()
//router
const roomRouter = (roomController) => {
  router.get('/', roomController.getAllRooms)
  router.get('/:id', roomController.getRoomById)
  router.post(
    '/',
    middleWare.protect,
    middleWare.restrictTo('admin'),
    uploadMultiple,
    uploadImage,
    roomController.addRoom,
  )
  router.patch(
    '/:id',
    middleWare.protect,
    middleWare.restrictTo('admin'),
    uploadMultiple,
    uploadImage,
    roomController.editRoom,
  )
  router.delete(
    '/:id',
    middleWare.protect,
    middleWare.restrictTo('admin'),
    roomController.deleteRoom,
  )

  return router
}

module.exports = roomRouter
