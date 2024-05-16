const User = require("../models/user");

// class AuthRepository {
//   constructor() {}

//   async addUser(newUser) {
//     // console.log("from AuthRepository", newUser);
//     return await User.create({
//       firstName: newUser.firstName,
//       lastName: newUser.lastName,
//       email: newUser.email,
//       password: newUser.password,
//       role: newUser.role,
//     });
//   }

//   async login(user) {
//     return await User.findOne({ email: user.email });
//   }
// }

// module.exports = AuthRepository;
///////////////////////////////////////////
const bcrypt = require("bcrypt");

class AuthRepository {
  constructor() {}

  async signup(newUser) {
    const hashedPassword = await bcrypt.hash(newUser.password, 12);

    return await User.create({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: hashedPassword,
      role: newUser.role,
    });
  }

  async login(user) {
    return await User.findOne({ email: user.email });
    // if (!foundUser) {
    //   throw new Error("invalid email or password");
    // }
  }
}

module.exports = AuthRepository;

///////////////////////////////////////////////
// if (!user.password) {
//     throw new Error("must write your password");
//   }

//   if (!user.email) {
//     throw new Error("must write your email");
//   }

//   const foundUser = await User.findOne({ email: user.email });
//   if (!foundUser) {
//     throw new Error("invalid email or password");
//   }

//   const passwordMatch = await bcrypt.compare(
//     user.password,
//     foundUser.password
//   );

//   if (passwordMatch) {
//     return foundUser;
//   } else {
//     throw new Error("invalid email or password");
//   }
