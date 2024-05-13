const jwt = require("jsonwebtoken");
const User = require("./../models/user.model");
const AppError = require("./../unites/appError");
const { promisify } = require("util");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = await promisify(jwt.verify)(token, "JWT_SECRET");

      const currentUser = await User.findOne({ _id: decoded.id });
      if (!currentUser) {
        throw new AppError("User not found", 404);
      }

      req.user = currentUser;

      next();
    } else {
      throw new AppError(
        "You are not logged in! Please log in to get access.",
        401
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.restrictTo = (role) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (req.user.role !== role) {
      return next(
        new AppError("You do not have permission to access this route", 403)
      );
    }
    next();
  };
};
