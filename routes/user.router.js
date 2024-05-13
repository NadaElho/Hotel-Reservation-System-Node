const express = require("express");
const middleWare = require("../middleware/auth");
const User = require("./../models/user.model");

const router = express.Router();

const userRouter = (userController) => {
  router.get(
    "/",
    middleWare.protect,
    middleWare.restrictTo("admin"),
    async (req, res) => {
      try {
        const users = await userController.getAllUsers();
        res.send(users);
      } catch (error) {
        res.status(500).json({ message: "Server Error" });
      }
    }
  );
  //////////////////////////////////////////////////////////////
  router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) {
        res.status(404).send("this user is not exist");
        return;
      }
      await userController.getUserById(id);
      res.send(user);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.post("/signup", async (req, res) => {
    try {
      const user = req.body;
      await userController.addUser(user);
      res.send("the user added successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.post("/login", async (req, res) => {
    try {
      const user = req.body;
      const token = await userController.login(user);
      res.json({ message: "loggin succesffly", token });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) {
        res.status(404).send("this user is not exist");
        return;
      }
      await userController.deleteUser(id);
      res.status(200).send("The user deleted successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////
  router.patch("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      const userBody = req.body;
      if (!user) {
        res.status(404).send("this user is not exist");
        return;
      }
      await userController.updateUser(id, userBody);
      res.status(201).send("This user updated successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  //////////////////////////////////////////////////////////////

  return router;
};

module.exports = userRouter;
