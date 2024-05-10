const express = require("express");
const router = express.Router();
const Hotel = require("../models/hotel.model");
const hotelRouter = (hotelController) => {
  //////////////////////////////////////////////////////////////

  router.get("/", async (req, res) => {
    try {
      const hotels = await hotelController.getAllHotels();
      res.send(hotels);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const hotel = await Hotel.findById(id);
      if (!hotel) {
        res.status(404).send("this hotel is not exist");
        return;
      }
      await hotelController.getHotelById(id);
      res.send(hotel);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.post("/", async (req, res) => {
    try {
      const hotel = req.body;
      await hotelController.addHotel(hotel);
      res.send("the hotel added successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const hotel = await Hotel.findById(id);
      if (!hotel) {
        res.status(404).send("this hotel is not exist");
        return;
      }
      await hotelController.deleteHotel(id);
      res.status(200).send("The hotel deleted successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.patch("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const hotel = await Hotel.findById(id);
      const hotelBody = req.body;
      if (!hotel) {
        res.status(404).send("this hotel is not exist");
        return;
      }
      await hotelController.editHotel(id, hotelBody);
      res.status(201).send("This hotel updated successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////

  return router;
};

module.exports = hotelRouter;
