const mongoose = require("mongoose");

const dbConnection = mongoose
  .connect("mongodb://localhost/final-project")
  .then((data) => console.log("connected successfuly"))
  .catch((err) => console.log(err));

module.exports = dbConnection;
