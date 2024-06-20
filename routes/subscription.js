const express = require("express");
const { protect, restrictTo } = require("../middlewares/auth");
const {
  validateNewSubscription,
  validateUpdateSubscription,
} = require("../validations/subscription");
const BadRequestError = require("../handleErrors/badRequestError");
const router = express.Router();

const subscriptionRouter = (subscriptionController) => {
  router.get("/", protect, restrictTo("admin"), async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
      const result = await subscriptionController.getAllSubscriptions(
        skip,
        limit
      );
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
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  router.post("/", protect, async (req, res) => {
    try {
      const { error } = validateNewSubscription(req.body);
      if (error) {
        throw new BadRequestError(error.message);
      }
      const subscription = await subscriptionController.addSubscription(
        req.body
      );

      res.status(201).json({
        status: "success",
        message: "Subscription  added successfully",
        data: subscription,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  router.patch("/:id", protect, async (req, res) => {
    try {
      const { id } = req.params;
      const room = await subscriptionController.getSubscriptionById({
        _id: id,
      });
      const { error } = validateUpdateSubscription(req.body);
      if (error) {
        throw new BadRequestError(error.message);
      }
      const updatesubscription = await subscriptionController.editSubscription(
        { _id: id },
        { ...req.body }
      );

      const findNewSubscription =
        await subscriptionController.getSubscriptionById({
          _id: id,
        });
      res.status(200).json({
        status: "success",
        message: "Subscription  updated successfully",
        subscription: findNewSubscription,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  router.delete("/:id", protect, async (req, res) => {
    try {
      const { id } = req.params;
      const room = await subscriptionController.getSubscriptionById({
        _id: id,
      });

      if (!room) {
        res.status(404).json("Subscription  not found");
        return;
      }
      await subscriptionController.deleteSubscription({ _id: id });

      res.status(200).json({
        status: "success",
        message: "Subscription  deleted successfully",
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const subscription = await subscriptionController.getSubscriptionById({
        _id: id,
      });
      res.status(200).json({
        status: "success",
        message: "subscription  founded",
        data: subscription,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  return router;
};

module.exports = subscriptionRouter;
