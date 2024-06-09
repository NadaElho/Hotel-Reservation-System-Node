const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middlewares/auth");
const { uploadMultiple } = require("../middlewares/multer");
const { uploadImage } = require("../middlewares/firebase");
const { deleteImages } = require("../middlewares/firebase");
const notFoundError = require("../handleErrors/notFoundError");
const {
  ValidateAddAmenity,
  ValidateEditAmenity,

} = require('../validations/amenity')
const BadRequestError = require('../handleErrors/badRequestError')


const amenityRouter = (amenityController) => {
  router.get("/", async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
      const result = await amenityController.getAllAmenities(skip, limit);
      const { data, documentCount } = result;
      const pagination = {
        currentPage: page,
        limit,
        numberPages: Math.ceil(documentCount / limit),
        documentCount,
      };
      if (endIndex < documentCount) {
        pagination.nextPage = page + 1;
      }

      if (skip > 0) {
        pagination.prevPage = page - 1;
      }
      res.status(200).json({ status: "success", pagination, data: data });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });


  router.get('/:id',
   protect,
   async (req, res) => {

    try {
      const amenity = await amenityController.getAmenityById(req.params.id);
      if (!amenity) throw new notFoundError("this amenity does not exist");
      res.status(200).json({ data: amenity });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.post(
    "/",
    protect,
    restrictTo("admin"),
    uploadMultiple,
    uploadImage,
    async (req, res) => {
      try {
        const { error } = ValidateAddAmenity(req.body);
        if (error) throw new BadRequestError(error.message);
        await amenityController.addAmenity(req.body);
        res.status(201).json({ message: "the amenity added successfully" });
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
      }
    }
  );


  router.delete('/:id',
   protect, restrictTo('admin'),
   async (req, res) => {
    try {
      const amenity = await amenityController.getAmenityById(req.params.id);
      if (!amenity) throw new notFoundError("this amenity does not exist");
      // await deleteImages(amenity.images);
      await amenityController.deleteAmenity(req.params.id);
      res.status(200).json({ message: "The amenity deleted successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.patch(
    "/:id",
    protect,
    restrictTo('admin'),
    uploadMultiple,
    uploadImage,
    async (req, res) => {
      try {
        const amenity = await amenityController.getAmenityById(req.params.id);
        if (!amenity) throw new notFoundError("this amenity does not exist");
        // if (req.body.images) {
        //   await deleteImages(amenity.images);
        // }

        const { error } = ValidateEditAmenity(req.body);
        if (error) throw new BadRequestError(error.message);
        await amenityController.editAmenity(req.params.id, req.body)
        res.status(200).json({ message: 'The amenity updated successfully' })

      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
      }
    }
  );

  return router;
};

module.exports = amenityRouter;
