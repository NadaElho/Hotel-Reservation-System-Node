const express = require("express");
const { protect, restrictTo } = require("../middlewares/auth");
const {
  validateNewRoomType,
  validateUpdateRoomType,
} = require("../validations/roomType");
const BadRequestError = require("../handleErrors/badRequestError");
const router = express.Router();

const roomTypeRouter = (roomTypeController) => {
  router.get("/", async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
      const result = await roomTypeController.getAllRoomsType(skip, limit);
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
  router.post("/", protect, restrictTo("admin"), async (req, res) => {
    try {
      const { error } = validateNewRoomType(req.body);
      if (error) {
        throw new BadRequestError(error.message);
      }
      const roomType = await roomTypeController.addRoomType({ ...req.body });
      res.status(201).json({
        status: "success",
        message: " Rome Type added successfully",
        roomType: roomType,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  router.patch("/:id", protect, restrictTo("admin"), async (req, res) => {
    try {
      const { id } = req.params;
      const room = await roomTypeController.getRoomTypeById({ _id: id });
      const { error } = validateUpdateRoomType(req.body);
      if (error) {
        throw new BadRequestError(error.message);
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
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
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
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const room = await roomTypeController.getRoomTypeById({ _id: id });
      res.status(200).json({
        status: "success",
        message: "Room Type founded",
        data: room,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  return router;
};

module.exports = roomTypeRouter;
