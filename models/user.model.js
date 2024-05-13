const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const validator = require("validator");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name!"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "please tell us your email!"],
    lowercase: true,
    validate: [validator.isEmail, "please enter valid  email!"],
  },
  photo: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    default: "user",
  },
  password: {
    type: String,
    required: [true, "please provide a password!"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: [true, "please confirm your password  !"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Role = mongoose.model("Role", roleSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Role, User };
