const express = require("express");
const { protect, restrictTo } = require("../middlewares/auth");
const BadRequestError = require("../handleErrors/badRequestError");
const {
  validateUpdateReservationStatus,
  validateNewReservationStatus,
} = require("../validations/reservationStatus");
const router = express.Router();

const reservationSatusRouter = (reservationSatusController) => {
  router.get("/", protect, restrictTo("admin"), async (req, res) => {
    try {
      const getAllTypes =
        await reservationSatusController.getReservationStatus();
      res.status(200).json({ data: getAllTypes });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.post("/", protect, restrictTo("admin"), async (req, res) => {
    try {
      const { error } = validateNewReservationStatus(req.body);
      if (error) {
        throw new BadRequestError(error.message);
      }
      await reservationSatusController.addReservationStatus(req.body);
      res.status(201).json({ data: req.body });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.patch("/:id", protect, restrictTo("admin"), async (req, res) => {
    try {
      const { error } = validateUpdateReservationStatus(req.body);
      if (error) {
        throw new BadRequestError(error.message);
      }
      await reservationSatusController.editReservationStatus(
        req.params.id,
        req.body
      );
      res.status(200).json({ data: req.body });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
    try {
      await reservationSatusController.deleteReservationStatus(req.params.id);
      res
        .status(200)
        .json({ message: "Reservation status deleted successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const reservationStatus =
        await reservationSatusController.getReservationStatusById({ _id: id });
      res.status(200).json({
        status: "success",
        message: "Reservation Status founded",
        data: reservationStatus,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  return router;
};

module.exports = reservationSatusRouter;
