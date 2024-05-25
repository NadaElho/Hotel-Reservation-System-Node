const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middlewares/auth");
const { uploadMultiple } = require("../middlewares/multer");
const { uploadImage, deleteImages } = require("../middlewares/firebase");
const notFoundError = require("../handleErrors/notFoundError");
const { ValidateAddHotel, ValidateEditHotel } = require("../validations/hotel");
const BadRequestError = require("../handleErrors/badRequestError");

const hotelRouter = (hotelController) => {
  router.get('/', async (req, res) => {
    try {
      const hotels = await hotelController.getAllHotels()
      res.status(200).json({ data: hotels })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.get("/:id", async (req, res) => {
    try {
      const hotel = await hotelController.getHotelById(req.params.id)
      if (!hotel) throw new notFoundError('this amenty does not exist')
      res.status(200).json({ data: hotel })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
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
        const { error } = ValidateAddHotel(req.body);
        if (error) throw new BadRequestError(error.message);
        await hotelController.addHotel(req.body);
        res.status(201).json({ message: "the hotel added successfully" });
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
      }
    },
  )

  router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
      const hotel = await hotelController.getHotelById(req.params.id);
      if (!hotel) throw new notFoundError("This hotel does not exist");
      await deleteImages(hotel.images);
      await hotelController.deleteHotel(req.params.id);
      res.status(200).json({ message: "The hotel was deleted successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
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
        const hotel = await hotelController.getHotelById(req.params.id)
        if (!hotel) throw new notFoundError('this hotel does not exist')
        if (req.body.images) {
          await deleteImages(hotel.images)
        }
        const { error } = ValidateEditHotel(req.body);
        if (error) throw new BadRequestError(error.message);
        await hotelController.editHotel(req.params.id, req.body);
        res.status(200).json({ message: "the hotel updated successfully" });
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
      }
    },
  )

  return router
}

module.exports = hotelRouter
