const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { promisify } = require('util')
const NotFoundError = require('../handleErrors/notFoundError')
const AuthError = require('../handleErrors/authError')
const ForbiddenError = require('../handleErrors/forbiddenError')

exports.protect = async (req, res, next) => {
  try {
    let token
    const auth = req.headers.authorization
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1]

      const decoded = await (jwt.verify)(
        token,
        process.env.JWT_SECRET_KEY,
      )

      const currentUser = await User.findOne({ _id: decoded.id })
      if (!currentUser) {
        throw new NotFoundError('this user not found')
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
