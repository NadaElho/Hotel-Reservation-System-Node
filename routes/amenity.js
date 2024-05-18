const express = require('express')
const router = express.Router()
const { protect, restrictTo } = require('../middlewares/auth')
const { uploadMultiple } = require('../middlewares/multer')
const { uploadImage } = require('../middlewares/firebase')
const { deleteImages } = require('../middlewares/firebase')
const notFoundError = require('../handleErrors/notFoundError')
const {
  ValidateAddAmenity,
  ValidateEditAmenity,
} = require('../validations/amenity')
const badRequestError = require('../handleErrors/badRequestError')

const amenityRouter = (amenityController) => {
  router.get('/', async (req, res) => {
    try {
      const amenities = await amenityController.getAllAmenities()
      res.status(200).json({ data: amenities })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.get('/:id', protect, async (req, res) => {
    try {
      const amenity = await amenityController.getAmenityById(req.params.id)
      if (!amenity) throw new notFoundError('this amenity does not exist')

      res.status(200).json({ data: amenity })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.post(
    '/',
    protect,
    restrictTo("admin"),
    uploadMultiple,
    uploadImage,
    async (req, res) => {
      try {
        const { error } = ValidateAddAmenity(req.body);
        if (error) throw new badRequestError(error.message);
        await amenityController.addAmenity(req.body);
        res.status(201).json({ message: "the amenity added successfully" });
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
      }
    },
  )

  router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
      const amenity = await amenityController.getAmenityById(req.params.id);
      if (!amenity) throw new notFoundError("this amenity does not exist");
      await deleteImages(amenity.images);
      await amenityController.deleteAmenity(req.params.id);
      res.status(200).json({ message: "The amenity deleted successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.patch(
    '/:id',
    protect,
    restrictTo('admin'),
    uploadImage,
    async (req, res) => {
      try {
        const { error } = ValidateEditAmenity(req.body);
        if (error) throw new badRequestError(error.message);
        const amenity = await amenityController.getAmenityById(req.params.id);
        if (!amenity) throw new notFoundError("this amenity does not exist");
        if (req.body.images) {
          await deleteImages(amenity.images)
        }
        await amenityController.editAmenity(req.params.id, req.body)
        res.status(200).json({ message: 'The amenity updated successfully' })
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
      }
    },
  )

  return router
}

module.exports = amenityRouter
