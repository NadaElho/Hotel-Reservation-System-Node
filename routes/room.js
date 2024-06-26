const express = require("express");
const { uploadImage, deleteImages } = require("../middlewares/firebase");
const { protect, restrictTo } = require("../middlewares/auth");
const { uploadMultiple } = require("../middlewares/multer");
const { validateNewROOm, validateUpdateRoom } = require("../validations/room");
const BadRequestError = require("../handleErrors/badRequestError");

const router = express.Router();
//router
const roomRouter = (roomController) => {
  router.get(["/:hotelId/hotelRooms", "/"], async (req, res) => {
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
        "amenitiesIds",
        "roomTypeId",
        "hotelId",
        "roomsId",
      ];
      excludedFields.forEach((el) => delete queryObj[el]);
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt|eq)\b/g,
        (match) => `$${match}`
      );
      const parse = JSON.parse(queryStr);
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
      let query = {};
      let sortBy;
      let queryRoom = {};
      let roomTypeId;
      let hotelId;
      //search
      if (req.query.checkIn && req.query.checkOut) {
        const getRoomReservations =
          await roomController.getReservationsBetweenDates(
            req.query.checkIn,
            req.query.checkOut
          );
        const roomIds = getRoomReservations.map((res) => {
          return res.roomId;
        });

        if (req.query.roomTypeId) {
          roomTypeId = req.query.roomTypeId;
        }
        if (req.query.hotelId) {
          hotelId = req.query.hotelId;
        }

        queryRoom = {
          _id: { $nin: roomIds },
        };
      }

      //filter
      let amenities;
      let roomsId;
      if (req.query.amenitiesIds) {
        const fields = req.query.amenitiesIds.split(",");
        amenities = { amenitiesIds: { $all: fields } };
      }
      if (req.params.hotelId) {
        query = { ...filterObj };
      }
      if (req.query.roomsId) {
        const fields = req.query.roomsId.split(",");
        roomsId = { _id: { $in: fields } };
      }
      if (hotelId && roomTypeId) {
        query = {
          ...queryRoom,
          roomTypeId,
          hotelId,
          ...query,
          ...parse,
          ...amenities,
        };
      } else if (roomsId) {
        query = { ...roomsId };
      } else if (roomTypeId) {
        query = { ...queryRoom, roomTypeId, ...query, ...parse, ...amenities };
      } else if (hotelId) {
        query = { ...queryRoom, hotelId, ...query, ...parse, ...amenities };
      } else {
        query = { ...queryRoom, ...query, ...parse, ...amenities };
      }

      //sort
      if (req.query.sort) {
        sortBy = req.query.sort.split(",").join(" ");
      }

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
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const room = await roomController.getRoomById({ _id: id });
      res.status(200).json({
        status: "success",
        message: "Room  updated successfully",
        room: room,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  router.post(
    "/",
    protect,

    uploadMultiple,
    uploadImage,
    async (req, res) => {
      try {
        const { error } = validateNewROOm(req.body);
        if (error) {
          throw new BadRequestError(error.message);
        }
        const roomByNumber = await roomController.getRoomByroomNumber({
          roomNumber: req.body.roomNumber,
        });
        if (roomByNumber) {
          throw new BadRequestError("Room number is already exists");
        } else {
          const room = await roomController.addRoom({ ...req.body });
          res.status(201).json({
            status: "success",
            message: "Rome added successfully",
            room: room,
          });
        }
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
      }
    }
  );
  router.get("/:id/roomReserved", async (req, res) => {
    try {
      let roomNotAvailable = await roomController.getNotAvailableDays(
        req.params.id
      );
      res.status(200).json({ data: roomNotAvailable });
    } catch (error) {
      console.log(error);
    }
  });

  router.patch(
    "/:id",
    protect,
    restrictTo("admin"),
    uploadMultiple,
    uploadImage,
    async (req, res) => {
      try {
        const { id } = req.params;
        const room = await roomController.getRoomById({ _id: id });
        const { error } = validateUpdateRoom(req.body);
        if (error) {
          throw new BadRequestError(error.message);
        }

        // if (req.body.images) {
        //   await deleteImages(room.images)
        // }

        await roomController.editRoom({ _id: id }, { ...req.body });

        const findNewRoom = await roomController.getRoomById({
          _id: id,
        });

        res.status(200).json({
          status: "success",
          message: "Room updated successfully",
          room: findNewRoom,
        });
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
      }
    }
  );

  router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
    try {
      const { id } = req.params;
      const room = await roomController.getRoomById({ _id: id });
      // await deleteImages(room.images)
      await roomController.deleteRoom({ _id: id });

      res.status(200).json({
        status: "success",
        message: "Room deleted successfully",
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  //* favourite**
  router.get("/favourites/:userId", protect, async (req, res) => {
    try {
      const { userId } = req.params;
      const favouriteRooms = await roomController.getRoomsInFavourite(userId);
      if (favouriteRooms.length === 0)
        throw Error("There are no rooms in favourite");
      res.status(200).json({ data: favouriteRooms });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.post("/favourites/:userId", protect, async (req, res) => {
    try {
      const { userId } = req.params;
      const { roomId } = req.body;
      await roomController.addRoomToFavourite(userId, roomId);
      res
        .status(201)
        .json({ message: "Room added to favourites successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.delete("/favourites/:userId", protect, async (req, res) => {
    try {
      const { userId } = req.params;
      const { roomId } = req.body;
      await roomController.deleteRoomFromFavourite(userId, roomId);
      res
        .status(200)
        .json({ message: "Room deleted from favourites successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  return router;
};

module.exports = roomRouter;
