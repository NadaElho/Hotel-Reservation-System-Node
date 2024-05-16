const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { promisify } = require('util')
const NotFoundError = require('../utils/notFoundError')
const AuthError = require('../utils/AuthError')
const ForbiddenError = require('../utils/ForbiddenError')

exports.protect = async (req, res, next) => {
  try {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]

      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET_KEY,
      )

      const currentUser = await User.findOne({ _id: decoded.id })
      if (!currentUser) {
        throw new NotFoundError('User not found')
      }
      req.user = currentUser

      next()
    } else {
      throw new AuthError('You are not logged in! Please log in to get access.')
    }
  } catch (error) {
    next(error)
  }
}

exports.restrictTo = (role) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('role')
    if (user.role.name !== role) {
      return next(
        new ForbiddenError('You do not have permission to access this route'),
      )
    }
    next()
  }
}
