const express = require("express");
const router = express.Router();


const middleWare = require("../middleware/auth");
const hotelRouter = (hotelController, roomController) => {
  router.use("/:hotelId/rooms", roomController.getAllRooms);
  //////////////////////////////////////////////////////////////
  router.get("/", async (req, res) => {
    try {
      const Allhotels = await hotelController.getAllHotels();
      res.send(Allhotels);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.get("/:id",  async (req, res) => {
    try {
      const hotel = await hotelController.getHotelById(req.params.id);
      if (!hotel) {
        res.status(404).send("this hotel  does not exist");
        return;
      }
      res.send(hotel);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.post("/",  async (req, res) => {
    try {
      await hotelController.addHotel(req.body);
      res.status(201).send("the hotel added successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.delete("/:id",  async (req, res) => {
    try {
      const hotel = await hotelController.getHotelById(req.params.id);
      if (!hotel) {
        res.status(404).send("This hotel does not exist");
        return;
      }
      await hotelController.deleteHotel(req.params.id);
      res.status(200).send("The hotel was deleted successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });

  //////////////////////////////////////////////////////////////
  router.patch("/:id",  async (req, res) => {
    try {
      const hotel = await hotelController.getHotelById(req.params.id);
      if (!hotel) {
        res.status(404).send("this hotel does not exist");
        return;
      }
      await hotelController.editHotel(req.params.id, req.body);
      res.status(200).send("This hotel updated successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////

  // router.use("/:hotelId/rooms",roomRouter );
 

  return router;
};

module.exports = hotelRouter;



////////////////////

