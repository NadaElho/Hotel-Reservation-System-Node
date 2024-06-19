const express = require("express");
const { protect, restrictTo } = require("../middlewares/auth");
const {
  validateNewSubscriptionAdvantage,
  validateUpdateSubscriptionAdvantage,
} = require("../validations/subscriptionAdvantage");
const BadRequestError = require("../handleErrors/badRequestError");
const router = express.Router();

const subscriptionAdvantageRouter = (subscriptionAdvantageController) => {
  router.get("/", protect, restrictTo("admin"), async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
      const result =
        await subscriptionAdvantageController.getAllSubscriptionsAdvantage(
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
  router.post("/", protect, restrictTo("admin"), async (req, res) => {
    try {
      const { error } = validateNewSubscriptionAdvantage(req.body);
      if (error) {
        throw new BadRequestError(error.message);
      }
      const subscriptionAdvantage =
        await subscriptionAdvantageController.addSubscriptionAdvantage({
          ...req.body,
        });
      res.status(201).json({
        status: "success",
        message: "Subscription Advantage added successfully",
        subscriptionAdvantage: subscriptionAdvantage,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  router.patch("/:id", protect, restrictTo("admin"), async (req, res) => {
    try {
      const { id } = req.params;
      const room =
        await subscriptionAdvantageController.getSubscriptionAdvantageById({
          _id: id,
        });
      const { error } = validateUpdateSubscriptionAdvantage(req.body);
      if (error) {
        throw new BadRequestError(error.message);
      }
      const updatesubscriptionAdvantage =
        await subscriptionAdvantageController.editSubscriptionAdvantage(
          { _id: id },
          { ...req.body }
        );

      const findNewSubscriptionAdvantage =
        await subscriptionAdvantageController.getSubscriptionAdvantageById({
          _id: id,
        });
      res.status(200).json({
        status: "success",
        message: "Subscription Advantage updated successfully",
        subscriptionAdvantage: findNewSubscriptionAdvantage,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
    try {
      const { id } = req.params;
      const room =
        await subscriptionAdvantageController.getSubscriptionAdvantageById({
          _id: id,
        });

      if (!room) {
        res.status(404).json("Subscription Advantage not found");
        return;
      }
      await subscriptionAdvantageController.deleteSubscriptionAdvantage({
        _id: id,
      });

      res.status(200).json({
        status: "success",
        message: "Subscription Advantage deleted successfully",
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const subscriptionAdvantage =
        await subscriptionAdvantageController.getSubscriptionAdvantageById({
          _id: id,
        });
      res.status(200).json({
        status: "success",
        message: "subscription Advantage founded",
        data: subscriptionAdvantage,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  return router;
};

module.exports = subscriptionAdvantageRouter;
