const mongoose = require("mongoose");
const { randomBytes, createHash } = require("crypto");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: ["you must enter a First Name!"],
  },
  lastName: {
    type: String,
    required: ["you must enter a Last Name!"],
  },
  email: {
    type: String,
    unique: true,
    required: ["you must enter an email!"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  images: [
    {
      type: String,
      required: ["Room must have Image"],
    },
  ],
  phoneNumber: {
    type: String,
    match: [/^\d{11}$/, "Phone number must be 11 digits"],
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    // required: true,
  },
  password: {
    type: String,
    required: ["you must enter a password!"],
    minlength: 8,
  },
  emergencyContact: {
    type: String,
  },
  resetToken: {
    type: String,
    createdAt: { type: Date, expires: 600, default: Date.now },
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
  },
  favouriteRooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],

  passwordResetExpires: Date,
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = randomBytes(32).toString("hex");

  this.resetToken = createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

userSchema.methods.resetPassword = async function (newPassword) {
  this.password = await bcrypt.hash(newPassword, 12);
  this.resetToken = undefined;
  this.passwordResetExpires = undefined;
};
userSchema.methods.addToken = async function (token) {
  this.resetToken = token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
