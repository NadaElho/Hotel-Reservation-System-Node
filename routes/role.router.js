const express = require("express");
const { protect, restrictTo } = require('../middleware/auth')
const router = express.Router();

const roleRouter = (roleController) => {
  router.get(
    "/",
    protect,
    restrictTo("admin"),
    async (req, res) => {
      try {
        const getAllRoles =
          await roleController.getRole();
        if (!getAllRoles.length) {
          res.status(404).send(`No roles found`);
        } else {
          res.status(200).send(getAllRoles);
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
    async (req, res) => {
      try {
        await roleController.addRole(req.body);
        res.status(201).send("Role added successfully");
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
        roleController.editRole(
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
        roleController.deleteRole(req.params.id);
        res.status(200).send("Reservation status deleted successfully");
      } catch (err) {
        res.status(500).send("Error happened");
      }
    }
  );

  return router;
};

module.exports = roleRouter;
