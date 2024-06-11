const express = require("express");
const router = express.Router();
const notFoundError = require("../handleErrors/notFoundError");
const {
  ValidateAddPromotion,
  ValidateEditPromotion,
} = require("../validations/promotion");
const BadRequestError = require("../handleErrors/badRequestError");
const { protect, restrictTo } = require("../middlewares/auth");

const promotionRouter = (promotionController) => {
  router.get("/", async (red, res) => {
    try {
      const getAllPromotions = await promotionController.getAllPromotions();
      res.status(200).json({ data: getAllPromotions });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.get("/:id", protect, async (req, res) => {
    try {
      const promotion = await promotionController.getPromotionById(
        req.params.id
      );
      if (!promotion) throw new notFoundError("this promotion does not exist");
      res.status(200).json({ data: promotion });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.post("/", protect, restrictTo("admin"), async (req, res) => {
    try {
      const { error } = ValidateAddPromotion(req.body);
      if (error) throw new BadRequestError(error.message);
      await promotionController.addPromotion(req.body);
      res.status(201).json({ message: "The promotion added successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.patch("/:id", protect, restrictTo("admin"), async (req, res) => {
    try {
      const promotion = await promotionController.getPromotionById(
        req.params.id
      );
      if (!promotion) throw new notFoundError("this promotion does not exist");
      const { error } = ValidateEditPromotion(req.body);
      if (error) throw new BadRequestError(error.message);
      await promotionController.editPromotion(req.params.id, req.body);
      res.status(200).json({ message: "The promotion updated successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
    try {
      const promotion = await promotionController.getPromotionById(
        req.params.id
      );
      if (!promotion) throw new notFoundError("this promotion does not exist");
      await promotionController.deletePromotion(req.params.id);
      res.status(200).json({ message: "The promotion deleted successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  return router;
};
module.exports = promotionRouter;
