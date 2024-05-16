const express = require("express");
const { protect, restrictTo } = require('../middlewares/auth');
const { validateNewRoomType, validateUpdateRoomType } = require("../validations/roomType");
const BadRequestError = require('../utils/badRequestError')
const router = express.Router();

const roomTypeRouter = (roomTypeController) => {
  //--------------------------------------------Find All  Room--------------------------------------------------------------
  router.get("/", async (req, res) => {
    try {

      const roomsType = await roomTypeController.getAllRoomsType();
      res.status(200).json({
        status: "success",
        data: roomsType,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  });
  //-------------------------------------------Create  Room--------------------------------------------------------------
  router.post(
    "/",
    protect,
    restrictTo("admin"),
    async (req, res) => {
      try {
        const { error } = validateNewRoomType(req.body)
        if (error) {
          throw new BadRequestError(error.message)
        }
        const roomType = await roomTypeController.addRoomType({
          ...req.body,
        });
        res.status(201).json({
          status: "success",
          message: " Rome Type added successfully",
          roomType: roomType,
        });
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
      }
    }
  );
  //-------------------------------------------Edit  Room--------------------------------------------------------------
  router.patch(
    "/:id",
    protect,
    restrictTo("admin"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const room = await roomTypeController.getRoomTypeById({ _id: id });
        const { error } = validateUpdateRoomType(req.body)
        if (error) {
          throw new BadRequestError(error.message)
        }
        const updateRoomType = await roomTypeController.editRoomType(
          { _id: id },
          { ...req.body }
        );

        const findNewRomeType = await roomTypeController.getRoomTypeById({
          _id: id
        });
        res.status(200).json({
          status: "success",
          message: " Room Type updated successfully",
          roomType: findNewRomeType,
        });
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
      }
    }
  );
  //-------------------------------------------Delete  Room--------------------------------------------------------------
  router.delete(
    "/:id",
    protect,
   restrictTo("admin"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const room = await roomTypeController.getRoomTypeById({ _id: id });

        if (!room) {
          res.status(404).json("Room Type not found");
          return;
        }
        await roomTypeController.deleteRoomType({ _id: id });

        res.status(200).json({
          status: "success",
          message: " Room Type deleted successfully",
        });
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
      }
    }
  );

  return router;
};

module.exports = roomTypeRouter;
