const express = require('express')
const router = express.Router()
const { protect, restrictTo } = require('../middlewares/auth')
const { uploadMultiple } = require('../middlewares/multer')
const { uploadImage } = require('../middlewares/firebase')
const { deleteImages } = require('../middlewares/firebase')

const amentyRouter = (amentyController) => {
  router.get('/', async (req, res) => {
    try {
      const allAmenties = await amentyController.getAllAmenties()
      res.send(allAmenties)
    } catch (error) {
      res.status(500).json({ message: 'Server Error' + error.message })
    }
  })

  router.get('/:id', protect, async (req, res) => {
    try {
      const amenty = await amentyController.getAmentyById(req.params.id)
      if (!amenty) {
        res.status(404).send('this amenty does not exist')
        return
      }
      res.send(amenty)
    } catch (error) {
      res.status(500).json({ message: 'Server Error: ' + error.message })
    }
  })

  router.post(
    '/',
    protect,
    restrictTo('admin'),
    uploadMultiple,
    uploadImage,
    async (req, res) => {
      try {
        await amentyController.addAmenty(req.body)
        res.status(201).json({ data: req.body })
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
    },
  )

  router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
      const amenty = await amentyController.getAmentyById(req.params.id)
      if (!amenty) {
        res.status(404).send('this amenty does not exist')
        return
      }
      if (req.body.images) {
        await deleteImages(room.images)
      }
      await amentyController.deleteAmenty(req.params.id)
      res.status(200).send('The amenty deleted successfully')
    } catch (error) {
      res.status(500).json({ message: 'Server Error' + error.message })
    }
  })

  router.patch(
    '/:id',
    protect,
    restrictTo('admin'),
    uploadMultiple,
    uploadImage,
    async (req, res) => {
      try {
        const amenty = await amentyController.getAmentyById(req.params.id)
        if (!amenty) {
          res.status(404).send('this amenty does not exist')
          return
        }
        if (req.body.images) {
          await deleteImages(room.images)
        }
        await amentyController.editAmenty(req.params.id, req.body)
        res.status(200).send('The amenty updated successfully')
      } catch (error) {
        res.status(500).json({ message: 'Server Error' + error.message })
      }
    },
  )

  return router
}

module.exports = amentyRouter
