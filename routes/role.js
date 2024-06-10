const express = require('express')
const { protect, restrictTo } = require('../middlewares/auth')
const router = express.Router()

const roleRouter = (roleController) => {
  router.get('/', protect, restrictTo('admin'), async (req, res) => {
    try {
      const getAllRoles = await roleController.getRoles()
      res.status(200).json({ data: getAllRoles })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.post('/', protect, restrictTo('admin'), async (req, res) => {
    try {
      await roleController.addRole(req.body)
      res.status(201).json({ data: req.body })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.patch('/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
      await roleController.editRole(req.params.id, req.body)
      res.status(200).json({ data: req.body })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
      await roleController.deleteRole(req.params.id)
      res
        .status(200)
        .json({ message: 'Role deleted successfully' })
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  })

  return router
}

module.exports = roleRouter
