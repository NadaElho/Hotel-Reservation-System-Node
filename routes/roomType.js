const express = require("express");
const { protect, restrictTo } = require('../middlewares/auth')
const router = express.Router();

const roomTypeRouter = (roomTypeController) => {
  //-------------------------------------------Find All  Room--------------------------------------------------------------
  router.get("/", async (req, res) => {
    try {
      const roomType = await roomTypeController.addRoomType({
        ...req.body,
      });
      res.status(201).json({
        status: "success",
        message: " Rome Type added successfully",
        roomType: roomType,
      });
    } catch (err) {
      res.status(500).json({ "Error happened ": err.message });
    }
  });
  //-------------------------------------------Create  Room--------------------------------------------------------------
  router.post(
    "/",
    protect,
    restrictTo("admin"),
    async (req, res) => {
      try {
        const roomType = await roomTypeController.addRoomType({
          ...req.body,
        });
        res.status(201).json({
          status: "success",
          message: " Rome Type added successfully",
          roomType: roomType,
        });
      } catch (err) {
        res.status(500).json({ "Error happened ": err.message });
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

        if (!room) {
          res.status(404).json("Room Type not found");
          return;
        }
        const updateRoomType = await roomTypeController.editRoomType(
          { _id: id },
          { ...req.body }
        );

        const findNewRomeType = await roomTypeController.getRoomTypeById({
          _id: id,
        });
        res.status(200).json({
          status: "success",
          message: " Room Type updated successfully",
          roomType: findNewRomeType,
        });
      } catch (err) {
        res.status(500).json({ "Error happened ": err.message });
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
      } catch (err) {
        res.status(500).json({ "Error happened ": err.message });
      }
    }
  );

  return router;
};

module.exports = roomTypeRouter;
