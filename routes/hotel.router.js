const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth')
const {uploadMultiple} = require("../middleware/multer");
const {uploadImage} = require("../middleware/firebase");
const { deleteImages } = require("../middleware/firebase");


const hotelRouter = (hotelController, roomController) => {
//-----------------------find room with hotleId----------------------
  router.use("/:hotelId/rooms", roomController.getAllRooms);
  //-------------------------------------------------//
  router.get("/", async (req, res) => {
    try {
      const Allhotels = await hotelController.getAllHotels();
      res.send(Allhotels);
    } catch (error) {
      res.status(500).json({ message: "Server Error: "+ error.message });
    }
  });
  
  router.get("/:id", protect, async (req, res) => {
    try {
      const hotel = await hotelController.getHotelById(req.params.id);
      if (!hotel) {
        res.status(404).send("this hotel  does not exist");
        return;
      }
      res.send(hotel);
    } catch (error) {
      res.status(500).json({ message: "Server Error: "+ error.message });
    }
  });
  
  router.post("/", protect, restrictTo("admin"),uploadMultiple , uploadImage, async (req, res) => {
    try {
      await hotelController.addHotel(req.body);
      res.status(201).send("the hotel added successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error: "+ error.message });
    }
  });

  router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
    try {
      const hotel = await hotelController.getHotelById(req.params.id);
      if (!hotel) {
        res.status(404).send("This hotel does not exist");
        return;
      }
      if (req.body.images) {
        await deleteImages(room.images)
      }
      await hotelController.deleteHotel(req.params.id);
      res.status(200).send("The hotel was deleted successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error: "+ error.message });
    }
  });

  router.patch("/:id", protect, restrictTo("admin"),uploadMultiple , uploadImage, async (req, res) => {
    try {
      const hotel = await hotelController.getHotelById(req.params.id);
      if (!hotel) {
        res.status(404).send("this hotel does not exist");
        return;
      }
      if (req.body.images) {
        await deleteImages(room.images)
      }
      await hotelController.editHotel(req.params.id, req.body);
      res.status(200).send("This hotel updated successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error: "+ error.message });
    }
  });

  return router;
};

module.exports = hotelRouter;