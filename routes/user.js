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
  router.delete("/delete-subscription", protect, async (req, res) => {
    try {
      const user = await userController.deleteSubscriptionToUser(req.user);
      res.status(200).json({
        status: "success",
        message: "user unsubscribed successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
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
      res.status(200).json({ status: "success", pagination, data: data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get("/:id", protect, async (req, res) => {
    try {
      const data = await userController.getUserById(req.params.id);
      res.status(200).json({ status: "success", data: data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post("/forgotPassword", async (req, res) => {
    try {
      const { email } = req.body;
      const response = await authController.forgotPassword(email, req);
      res.status(200).json({
        status: "success",
        message: "Token sent to email!  " + response,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.patch("/resetPassword/:token", async (req, res) => {
    try {
      const resetToken = req.params.token;
      const newPassword = req.body.password;

      const response = await authController.resetPassword(
        resetToken,
        newPassword
      );
      res.status(200).json({
        status: "success",
        message: "your password has updated this is new token : " + response,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      const data = await authController.signup({ ...user });
      res.json({
        message: "you signed up successfully, you must login",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const user = req.body;
      const data = await authController.login(user);
      res.json({ message: "loggin successfully", data });
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
      }
    }
  );
  router.patch("/:id/password", protect, async (req, res) => {
    try {
      const id = req.params.id;
      const user = await userController.getUserById(id);
      if (!user) {
        throw new NotFoundError("this user is not exist");
      }
      await userController.updaeUserPassword(id, req.body);
      res.status(201).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  router.patch("/add-subscription/:id", protect, async (req, res) => {
    try {
      const id = req.params.id;
      const user = await userController.addSubscriptionToUser(id, req.user);
      res.status(200).json({
        status: "success",
        message: "add subscription to user successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};

module.exports = userRouter;
