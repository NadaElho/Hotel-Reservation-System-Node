const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth')
const amentyRouter = (amentyController) => {
  //////////////////////////////////////////////////////////////
  router.get("/", async (req, res) => {
    try {
      const getAmenties = await amentyController.getAllAmenties();
      res.send(getAmenties);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });

  //////////////////////////////////////////////////////////////
  router.get("/:id",  async (req, res) => {
    try {
      const amenty = await amentyController.getAmentyById(req.params.id);
      if (!amenty) {
        res.status(404).send("this amenty does not exist");
        return;
      }
      res.send(amenty);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.post("/",  async (req, res) => {
    try {
      await amentyController.addAmenty(req.body);
      res.status(201).send("the amenty added successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.delete("/:id",  async (req, res) => {
    try {
      const amenty = await amentyController.getAmentyById(req.params.id);
      if (!amenty) {
        res.status(404).send("this amenty does not exist");
        return;
      }
      await amentyController.deleteAmenty(req.params.id);
      res.status(200).send("The amenty deleted successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.patch("/:id",  async (req, res) => {
    try {
      const amenty = await amentyController.getAmentyById(req.params.id);
      if (!amenty) {
        res.status(404).send("this amenty does not exist");
        return;
      }
      await amentyController.editAmenty(req.params.id, req.body);
      res.status(200).send("The amenty updated successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });

  return router;
};

module.exports = amentyRouter;

