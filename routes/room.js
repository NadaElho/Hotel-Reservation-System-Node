const express = require("express");
const { uploadMultiple } = require("../middleware/multer");
const { uploadImage } = require("../middleware/firebase");
const middleWare = require("../middleware/auth");
const Room = require("../models/room");
const { deleteImages } = require("../middleware/firebase");
const Reservation = require("../models/reservation.model");
const router = express.Router();
//router
const roomRouter = (roomController) => {
  //-------------------------------------------Find All  Room--------------------------------------------------------------
  router.get(['/:hotelId/hotelRooms', '/'], async (req, res) => {
    try {
      let filterObj = {};
      if (req.params.hotelId) filterObj = { hotelId: req.params.hotelId };
      const queryObj = { ...req.query, ...filterObj };
      const excludedFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "checkIn",
        "checkOut",
        "amentiesIds",
        "hotelId",
        "roomTypeId",
      ];
      excludedFields.forEach((el) => delete queryObj[el]);
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      const parse = JSON.parse(queryStr);
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
      let query = {};
      let sortBy;
      let queruRomm = {};

      //search
      if (
        req.query.roomTypeId &&
        req.query.hotelId &&
        req.query.checkIn &&
        req.query.checkOut
      ) {
        const getRoomReservations = await Reservation.find({
          $or: [
            {
              checkIn: { $lte: req.query.checkIn },
              checkOut: { $gte: req.query.checkIn },
            },
            {
              checkIn: { $lte: req.query.checkOut },
              checkOut: { $gte: req.query.checkOut },
            },
            {
              checkIn: { $gte: req.query.checkIn },
              checkOut: { $lte: req.query.checkOut },
            },
            {
              checkIn: { $lte: req.query.checkIn },
              checkOut: { $gte: req.query.checkOut },
            },
          ],
        });
        const roomIds = getRoomReservations.map((RES) => {
          return RES.roomId;
        });
        queruRomm = {
          _id: { $nin: roomIds },
          roomTypeId: req.query.roomTypeId,
          hotelId: req.query.hotelId,
        };
      }

      //filter
      let amenties;
      if (req.query.amentiesIds) {
        const fields = req.query.amentiesIds.split(",");
        amenties = { amentiesIds: { $all: fields } };
      }
      if (req.params.hotelId) {
        query = { ...filterObj };
      }
      query = { ...queruRomm, ...query, ...parse, ...amenties };
      //sort
      if (req.query.sort) {
        sortBy = req.query.sort.split(",").join(" ");
      }
      // else {
      //   sortBy = "-creatAt";
      // }
      // find data
      let result = await roomController.getAllRooms(query, sortBy, skip, limit);
      const { data, documentCount } = result;

      //pagination
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
    } catch (err) {
      res.status(500).json({ "Error happened": err.message });
    }
  });
  //-------------------------------------------Find Romm BY Id --------------------------------------------------------------
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const room = await roomController.getRoomById({ _id: id });

      if (!room) {
        res.status(404).json("Room  not found");
        return;
      }
      res.status(200).json({
        status: "success",
        message: " Room  updated successfully",
        room: room,
      });
    } catch (err) {
      res.status(500).json({ "Error happened ": err.message });
    }
  });
  //-------------------------------------------Create  Room--------------------------------------------------------------
  router.post(
    "/",
    middleWare.protect,
    middleWare.restrictTo("admin"),
    uploadMultiple,
    uploadImage,
    async (req, res) => {
      try {
        const room = await roomController.addRoom({ ...req.body });
        res.status(201).json({
          status: "success",
          message: "Rome added successfully",
          room: room,
        });
      } catch (err) {
        res.status(500).json({ "Error happened ": err.message });
      }
    }
  );
  //-------------------------------------------Edit  Room--------------------------------------------------------------
  router.patch(
    "/:id",
    middleWare.protect,
    middleWare.restrictTo("admin"),
    uploadMultiple,
    uploadImage,
    async (req, res) => {
      try {
        const { id } = req.params;
        const room = await roomController.getRoomById({ _id: id });

        if (!room) {
          res.status(404).json("Room not found");
          return;
        }

        if (req.body.images) {
          await deleteImages(room.images);
        }
        const updateRoom = await roomController.editRoom(
          { _id: id },
          { ...req.body }
        );

        const findNewRome = await roomController.getRoomById({
          _id: id,
        });
        res.status(200).json({
          status: "success",
          message: " Room updated successfully",
          room: findNewRome,
        });
      } catch (err) {
        res.status(500).json({ "Error happened ": err.message });
      }
    }
  );
  //-------------------------------------------Delete  Room--------------------------------------------------------------
  router.delete(
    "/:id",
    middleWare.protect,
    middleWare.restrictTo("admin"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const room = await roomController.getRoomById({ _id: id });

        if (!room) {
          res.status(404).json("Room not found");
          return;
        }
        await deleteImages(room.images);
        await roomController.deleteRoom({ _id: id });

        res.status(200).json({
          status: "success",
          message: " Room deleted successfully",
        });
      } catch (err) {
        res.status(500).json({ "Error happened ": err.message });
      }
    }
  );
  return router;
};

module.exports = roomRouter;
