const express = require("express");
const { protect, restrictTo } = require('../middleware/auth')
const router = express.Router();

const reservationSatusRouter = (reservationSatusController) => {
  router.get(
    "/",
    protect,
    restrictTo("admin"),
    async (req, res) => {
      try {
        const getAllTypes =
          await reservationSatusController.getReservationStatus();
        if (!getAllTypes.length) {
          res.status(404).send(`No reservation types found`);
        } else {
          res.status(200).send(getAllTypes);
        }
      } catch (err) {
        res.status(500).send(`Error Happened ${err}`);
      }
    }
  );

  router.post(
    "/",
    protect,
    restrictTo("admin"),
    (req, res) => {
      try {
        reservationSatusController.addReservationStatus(req.body);
        res.status(201).send("Reservation status added successfully");
      } catch (err) {
        res.status(500).send(`Error Happened ${err}`);
      }
    }
  );

  router.patch(
    "/:id",
    protect,
    restrictTo("admin"),
    (req, res) => {
      try {
        reservationSatusController.editReservationStatus(
          req.params.id,
          req.body
        );
        res.status(200).send("Reservation status updated successfully");
      } catch (err) {
        res.status(500).send(`Error Happened ${err}`);
      }
    }
  );

  router.delete(
    "/:id",
    protect,
    restrictTo("admin"),
    (req, res) => {
      try {
        reservationSatusController.deleteReservationStatus(req.params.id);
        res.status(200).send("Reservation status deleted successfully");
      } catch (err) {
        res.status(500).send("Error happened");
      }
    }
  );

  return router;
};

module.exports = reservationSatusRouter;
