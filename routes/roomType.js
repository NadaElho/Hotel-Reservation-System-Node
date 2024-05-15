const express = require('express')
const middleWare = require('../middlewares/auth')
const router = express.Router()

const roomTypeRouter = (roomTypeController) => {
  router.get('/', roomTypeController.getAllRoomsType)

  router.post(
    '/',
    middleWare.protect,
    middleWare.restrictTo('admin'),
    roomTypeController.addRoomType,
  )

  router.patch(
    '/:id',
    middleWare.protect,
    middleWare.restrictTo('admin'),
    roomTypeController.editRoomType,
  )

  router.delete(
    '/:id',
    middleWare.protect,
    middleWare.restrictTo('admin'),
    roomTypeController.deleteRoomType,
  )

  return router
}

module.exports = roomTypeRouter
