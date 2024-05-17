const express = require('express')
const { uploadImage, deleteImages } = require('../middlewares/firebase')
const { protect, restrictTo } = require('../middlewares/auth')
const Room = require('../models/room')
const Reservation = require('../models/reservation')
const { uploadMultiple } = require('../middlewares/multer')
const { validateNewROOm, validateUpdateRoom } = require('../validations/room')
const BadRequestError = require('../handleErrors/badRequestError')

const router = express.Router()
//router
const roomRouter = (roomController) => {
  //-------------------------------------------Find All  Room--------------------------------------------------------------
  router.get(['/:hotelId/hotelRooms', '/'], async (req, res) => {
    try {
      let filterObj = {}
      if (req.params.hotelId) filterObj = { hotelId: req.params.hotelId }
      const queryObj = { ...req.query, ...filterObj }
      const excludedFields = [
        'page',
        'sort',
        'limit',
        'fields',
        'checkIn',
        'checkOut',
        'amentiesIds',
        'hotelId',
        'roomTypeId',
      ]
      excludedFields.forEach((el) => delete queryObj[el])
      let queryStr = JSON.stringify(queryObj)
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`,
      )
      const parse = JSON.parse(queryStr)
      const page = req.query.page * 1 || 1
      const limit = req.query.limit * 1 || 6
      const skip = (page - 1) * limit
      const endIndex = page * limit
      let query = {}
      let sortBy
      let queruRomm = {}

      //search
      if (
        req.query.roomTypeId &&
        req.query.hotelId &&
        req.query.checkIn &&
        req.query.checkOut
      ) {
        const getRoomReservations = await roomController.getRoomNotReservations(req.query.checkIn, req.query.checkOut)
        const roomIds = getRoomReservations.map((RES) => {
          return RES.roomId
        })
        queruRomm = {
          _id: { $nin: roomIds },
          roomTypeId: req.query.roomTypeId,
          hotelId: req.query.hotelId,
        }
      }

      //filter
      let amenties
      if (req.query.amentiesIds) {
        const fields = req.query.amentiesIds.split(',')
        amenties = { amentiesIds: { $all: fields } }
      }
      if (req.params.hotelId) {
        query = { ...filterObj }
      }
      query = { ...queruRomm, ...query, ...parse, ...amenties }
      //sort
      if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(' ')
      }
      // find data
      let result = await roomController.getAllRooms(query, sortBy, skip, limit)
      const { data, documentCount } = result

      //pagination
      const pagination = {
        currentPage: page,
        limit,
        numberPages: Math.ceil(documentCount / limit),
        documentCount,
      }

      if (endIndex < documentCount) {
        pagination.nextPage = page + 1
      }

      if (skip > 0) {
        pagination.prevPage = page - 1
      }

      res.status(200).json({ status: 'success', pagination, data: data })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })
  //-------------------------------------------Find Romm BY Id --------------------------------------------------------------
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params
      const room = await roomController.getRoomById({ _id: id })
      res.status(200).json({
        status: 'success',
        message: ' Room  updated successfully',
        room: room,
      })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })
  //-------------------------------------------Create  Room--------------------------------------------------------------
  router.post(
    '/',
    protect,
    restrictTo('admin'),
    uploadMultiple,
    uploadImage,
    async (req, res) => {
      try {
        const { error } = validateNewROOm(req.body)
        if (error) {
          throw new BadRequestError(error.message)
        }
        const room = await roomController.addRoom({ ...req.body })
        res.status(201).json({
          status: 'success',
          message: 'Rome added successfully',
          room: room,
        })
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
      }
    },
  )
  //-------------------------------------------Edit  Room--------------------------------------------------------------
  router.patch(
    '/:id',
    protect,
    restrictTo('admin'),
    uploadMultiple,
    uploadImage,
    async (req, res) => {
      try {
        const { id } = req.params
        const room = await roomController.getRoomById({ _id: id })
        const { error } = validateUpdateRoom(req.body)
        if (error) {
          throw new BadRequestError(error.message)
        }
        if (req.body.images) {
          await deleteImages(room.images)
        }
        await roomController.editRoom({ _id: id }, { ...req.body })

        const findNewRoom = await roomController.getRoomById({
          _id: id,
        })
        res.status(200).json({
          status: 'success',
          message: ' Room updated successfully',
          room: findNewRoom,
        })
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
      }
    },
  )
  //-------------------------------------------Delete  Room--------------------------------------------------------------
  router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
      const { id } = req.params
      const room = await roomController.getRoomById({ _id: id })
      await deleteImages(room.images)
      await roomController.deleteRoom({ _id: id })

      res.status(200).json({
        status: 'success',
        message: ' Room deleted successfully',
      })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })
  return router
}

module.exports = roomRouter
