const express = require("express");
const { protect, restrictTo } = require("../middlewares/auth");
const {
  validateNewReservation,
  validateUpdateReservation,
} = require("../validations/reservation");
const BadRequestError = require("../handleErrors/badRequestError");
const router = express.Router();

const reservationRouter = (reservationController) => {
  router.get("/", protect, restrictTo("admin"), async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 6;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
      const result = await reservationController.getAllReservations(
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

  router.get("/:userId", protect, async (req, res) => {
    try {
      const userReservations = await reservationController.getUserReservations(
        req.params.userId
      );
      res.status(200).json({ data: userReservations });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.get(
    "/room/:roomId",
    protect,
    restrictTo("admin"),
    async (req, res) => {
      try {
        const roomReservations =
          await reservationController.getRoomReservations(req.params.roomId);
        res.status(200).json({ data: roomReservations });
      } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
      }
    }
  );

  router.get("/reservation/:id", protect, async (req, res) => {
    try {
      const reservation = await reservationController.getReservation(
        req.params.id
      );
      res.status(200).json({ data: reservation });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.post("/", protect, async (req, res) => {
    try {
      const { error } = validateNewReservation(req.body);
      if (error) {
        throw new BadRequestError(error.message);
      }
      await reservationController.addNewReservation(req.body);
      res.status(201).json({ data: req.body });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.patch("/:id", protect, async (req, res) => {
    try {
      const { error } = validateUpdateReservation(req.body);
      if (error) {
        throw new BadRequestError(error.message);
      }
      await reservationController.editReservation(req.params.id, req.body);
      res.status(200).json({ data: req.body });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.patch("/:id/cancel", protect, async (req, res) => {
    try {
      await reservationController.cancelReservation(req.params.id);
      res.status(200).json({ message: "Reservation canceled" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  router.post("/:id/payment", protect, async (req, res) => {
    try {
      let response = await reservationController.payWithStripe(
        req,
        req.params.id
      );
      res.status(200).json({ status: "success", session: response });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });

  return router;
};

module.exports = reservationRouter;
