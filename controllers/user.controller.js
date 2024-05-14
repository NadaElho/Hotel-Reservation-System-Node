const AppError = require('../utils/appError')
const User = require('./../models/user.model')
const catchAsync = require('./../utils/catchAsync')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })

  return newObj
}

class UserController {
  constructor(UserRepository) {
    this.UserRepository = UserRepository
  }

  getAllUsers() {
    return this.UserRepository.getAllUsers
  }

  updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('this route in not for password updates', 400))
    }

    const filteredBody = filterObj(req.body, 'name', 'email')

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    )

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    })
  })

  deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.body.id, { active: false })

    res.status(204).json({
      status: 'success',
      data: null,
    })
  })

  getUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!',
    })
  }

  createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!',
    })
  }

  updateUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!',
    })
  }

  deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!',
    })
  }
  getUserById(id){
    return this.UserRepository.getUserById(id);
  }

}



module.exports = UserController
