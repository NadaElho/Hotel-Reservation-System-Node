const express = require("express");
const {protect, restrictTo} = require("../middlewares/auth");
const { uploadMultiple } = require("../middlewares/multer");
const { uploadImage, deleteImages } = require("../middlewares/firebase");
const router = express.Router();

const userRouter = (userController, authController) => {
  router.get(
    "/",
    protect,
    restrictTo("admin"),
    async (req, res) => {
      try {
        const users = await userController.getAllUsers();
        res.send(users);
      } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
      }
    }
  );

  router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const user = await userController.getUserById(id);
      if (!user) {
        throw new Error("this user is not exist");
      }
      res.send(user);
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  });

  router.post("/signup", uploadMultiple, uploadImage, async (req, res) => {
    try {
      const user = req.body;
      await authController.signup(user);
      res.json({ message: "signup is successfully , you must login " });
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const user = req.body;
      const token = await authController.login(user);
      res.json({ message: "loggin succesffly", token });
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const user = await userController.getUserById(id);
      if (!user) {
        throw new Error("this user is not exist");
      }

      await deleteImages(user.images);
      await userController.deleteUser(id);
      res.status(200).send("The user deleted successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  });

  router.patch("/:id", uploadMultiple, uploadImage, async (req, res) => {
    try {
      const id = req.params.id;
      const user = await userController.getUserById(id);
      const userBody = req.body;
      if (!user) {
        throw new Error("this user is not exist");
      }
      if (req.body.images) {
        await deleteImages(user.images);
      }
      await userController.updateUser(id, userBody);
      res.status(201).send("This user updated successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  });

  return router;
};

module.exports = userRouter;
