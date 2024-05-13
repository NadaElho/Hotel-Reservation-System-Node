const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "you must enter a First Name!"],
  },
  lastName: {
    type: String,
    required: [true, "you must enter a Last Name!"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "you must enter an email!"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'
  ]
  },
  gender:{
    type:String,
    enum: ['male', 'female'],
  },
  image: {
    type: String,
    default:' '
  },
  phoneNumber: {
    type: String,
    match:[
      /^\d{11}$/,'Phone number must be 11 digits'
    ]
   
},
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  password: {
    type: String,
    required: [true, "you must enter a password!"],
    minlength: 8,
   
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: [true, "you must confirm your password  !"],
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

const User = mongoose.model("User", userSchema);

module.exports =  User

