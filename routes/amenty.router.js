const express = require("express");
const router = express.Router();
const Amenty = require("../models/amenty.model");
const amentyRouter = (amentyController) => {
  //////////////////////////////////////////////////////////////
  router.get("/", async (req, res) => {
    try {
      const amenties = await amentyController.getAllAmenties();
      res.send(amenties);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const amenty = await Amenty.findById(id);
      if (!amenty) {
        res.status(404).send("this amenty is not exist");
        return;
      }
      await amentyController.getAmentyById(id);
      res.send(amenty);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.post("/", async (req, res) => {
    try {
      const amenty = req.body;
      await amentyController.addAmenty(amenty);
      res.status(200).send("the amenty added successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const amenty = await Amenty.findById(id);
      if (!amenty) {
        res.status(404).send("this amenty is not exist");
        return;
      }
      await amentyController.deleteAmenty(id);
      res.status(200).send("The amenty deleted successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.patch("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const amenty = await Amenty.findById(id);
      const amentyBody = req.body;
      if (!amenty) {
        res.status(404).send("this amenty is not exist");
        return;
      }
      await amentyController.editAmenty(id, amentyBody);
      res.status(201).send("The amenty updated successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });

  return router;
};

module.exports = amentyRouter;
