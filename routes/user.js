const express = require("express");
const { protect, restrictTo } = require("../middlewares/auth");
const { uploadMultiple } = require("../middlewares/multer");
const { uploadImage, deleteImages } = require("../middlewares/firebase");
const { validateNewUser, validateUpdateUser } = require("../validations/user");
const NotFoundError = require("../handleErrors/notFoundError");
const BadRequestError = require("../handleErrors/badRequestError");
const ForbiddenError = require("../handleErrors/forbiddenError");

const router = express.Router();

const userRouter = (userController, authController) => {
  router.get("/", protect, restrictTo("admin"), async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
      let result = await userController.getAllUsers(skip, limit);
      const { data, documentCount } = result;

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
      console.log(pagination, data);
      res.status(200).json({ status: "success", pagination, data: data });
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  });

  router.get("/:id", protect, restrictTo("admin"), async (req, res) => {
    try {
      const id = req.params.id;
      const user = await userController.getUserById(id);
      if (!user) {
        throw new NotFoundError("this user is not exist");
      }
      res.json({ data: user });
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  });

  router.post("/signup", async (req, res) => {
    try {
      const { error } = validateNewUser(req.body);
      if (error) {
        throw new BadRequestError(error.message);
      }
      const user = req.body;
      if (user.role == "6642764acd637f7c34eb4b97") {
        throw new ForbiddenError("You aren't allowed to be admin");
      }
      await authController.signup({ ...req.body });
      res.json({ message: "you signed up successfully, you must login" });
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const user = req.body;
      const token = await authController.login(user);
      res.json({ message: "loggin successfully", token });
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  });

  router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
    try {
      const id = req.params.id;
      const user = await userController.getUserById(id);
      if (!user) {
        throw new NotFoundError("this user is not exist");
      }

      await deleteImages(user.images);
      await userController.deleteUser(id);
      res.status(200).json({ message: "The user deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error.message });
    }
  });

  router.patch(
    "/:id",
    protect,
    uploadMultiple,
    uploadImage,
    async (req, res) => {
      try {
        const { error } = validateUpdateUser(req.body);
        if (error) {
          throw new BadRequestError(error.message);
        }
        const id = req.params.id;
        const user = await userController.getUserById(id);
        const userBody = req.body;
        if (!user) {
          throw new NotFoundError("this user is not exist");
        }
        if (req.body.images) {
          await deleteImages(user.images);
        }
        await userController.updateUser(id, userBody);
        res.status(201).json({ message: "This user updated successfully" });
      } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
      }
    }
  );

  return router;
};

module.exports = userRouter;
