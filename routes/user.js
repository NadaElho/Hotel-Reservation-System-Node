const express = require('express')
const middleWare = require('../middleware/auth')
const User = require('../models/user')
const { uploadMultiple } = require('../middleware/multer')
const { uploadImage, deleteImages } = require('../middleware/firebase')
const router = express.Router()

const userRouter = (userController) => {
  router.get(
    '/',
    middleWare.protect,
    middleWare.restrictTo('admin'),
    async (req, res) => {
      try {
        const users = await userController.getAllUsers()
        res.send(users)
      } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message })
      }
    },
  )

  router.get('/:id', async (req, res) => {
    try {
      const id = req.params.id
      const user = await User.findById(id)
      if (!user) {
        res.status(404).send('this user is not exist')
        return
      }
      await userController.getUserById(id)
      res.send(user)
    } catch (error) {
      res.status(500).json({ message: 'Server Error: ' + error.message })
    }
  })

  router.post('/signup', uploadMultiple, uploadImage, async (req, res) => {
    try {
      const user = req.body
      console.log('1234')
      await userController.addUser(user)
      res.send('the user added successfully')
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: 'Server Error: ' + error.message })
    }
  })

  router.post('/login', async (req, res) => {
    try {
      const user = req.body
      const token = await userController.login(user)
      res.json({ message: 'loggin succesffly', token })
    } catch (error) {
      // console.log(error.message);
      res.status(500).json({ message: 'Server Error: ' + error.message })
    }
  })

  router.delete('/:id', async (req, res) => {
    try {
      const id = req.params.id
      const user = await User.findById(id)
      if (!user) {
        res.status(404).send('this user is not exist')
        return
      }

      await deleteImages(user.images)
      await userController.deleteUser(id)
      res.status(200).send('The user deleted successfully')
    } catch (error) {
      res.status(500).json({ message: 'Server Error: ' + error.message })
    }
  })

  router.patch('/:id', uploadMultiple, uploadImage, async (req, res) => {
    try {
      const id = req.params.id
      const user = await User.findById(id)
      const userBody = req.body
      if (!user) {
        res.status(404).send('this user is not exist')
        return
      }
      if (req.body.images) {
        await deleteImages(user.images)
      }
      await userController.updateUser(id, userBody)
      res.status(201).send('This user updated successfully')
    } catch (error) {
      res.status(500).json({ message: 'Server Error: ' + error.message })
    }
  })

  return router
}

module.exports = userRouter
