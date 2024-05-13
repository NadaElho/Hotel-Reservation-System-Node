const { populate } = require("dotenv");
const Reservation = require("../models/reservation.model");
const Room = require("../models/room.model");
const { deleteImages } = require("../middleware/firebase");

class roomController {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
    // Bind methods to the instance to maintain the correct context
    this.addRoom = this.addRoom.bind(this);
    this.getAllRooms = this.getAllRooms.bind(this);
    this.getRoomById = this.getRoomById.bind(this);
    this.editRoom = this.editRoom.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
    ///
  }
  //-------------------------------------------Create  Room--------------------------------------------------------------
  async addRoom(req, res) {
    try {
      // const imagesId=req.imagesId
      const room = await this.roomRepository.addRoom({ ...req.body });
      res.status(201).json({
        status: "success",
        message: " Rome added successfully",
        room: room,
      });
    } catch (err) {
      res.status(500).json({ "Error happened ": err.message });
    }
  }

  //-----------------------------------------------find ALL Room--------------------------------------------------------
  async getAllRooms(req, res) {
    try {
   

      let filterObj = {};
      if (req.params.hotelId) filterObj = { hotelId: req.params.hotelId};
      const queryObj = { ...req.query,...filterObj };
      const excludedFields = ["page", "sort", "limit", "fields",'checkIn','checkOut','amentiesIds','hotelId','roomTypeId'];
      excludedFields.forEach((el) => delete queryObj[el]);
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      const parse=JSON.parse(queryStr);
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
      let query = {};
      let sortBy;
      let queruRomm = {};

      //search
      if (
        req.query.roomTypeId&&
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
      if(req.query.amentiesIds){
        
        const fields = req.query.amentiesIds.split(",");
        amenties={amentiesIds:{ $all: fields }}
        console.log('fields',fields,'samar ali')
        
      }
      if (req.params.hotelId) {
        query = {  ...filterObj };
      }
      query = { ...queruRomm ,...query,...parse,...amenties};
      //sort
      if (req.query.sort) {
        sortBy = req.query.sort.split(",").join(" ");
      } 
      // else {
      //   sortBy = "-creatAt";
      // }
      // find data
      let result = await this.roomRepository.getAllRooms(
        query,
        sortBy,
        skip,
        limit
      );
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
  }

  async getRoomById(req, res) {
    try {
      const { id } = req.params;
      const room = await this.roomRepository.getRoomById({ _id: id });

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
  }
  async editRoom(req, res) {
    try {
      const { id } = req.params;
      const room = await this.roomRepository.getRoomById({ _id: id });

      if (!room) {
        res.status(404).json("Room not found");
        return;
      }

      if (req.body.images) {
        console.log('req.body.images',room.images)

        await deleteImages(room.images)
      }
      // const fileId = req.fileId
      // const imagesId=req.imagesId
      const updateRoom = await this.roomRepository.editRoom(
        { _id: id },
        { ...req.body }
      );

      const findNewRome = await this.roomRepository.getRoomById({
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

  async deleteRoom(req, res) {
    try {
      const { id } = req.params;
      const room = await this.roomRepository.getRoomById({ _id: id });

      if (!room) {
        res.status(404).json("Room not found");
        return;
      }
      await deleteImages(room.images);
      await this.roomRepository.deleteRoom({ _id: id });

      res.status(200).json({
        status: "success",
        message: " Room deleted successfully",
      });
    } catch (err) {
      res.status(500).json({ "Error happened ": err.message });
    }
  }
}

module.exports = roomController;
