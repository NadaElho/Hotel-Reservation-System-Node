const mongoose = require("mongoose");

const dbConnection = mongoose
  .connect("mongodb://localhost/final-project")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("could not connect to MongoDB...", err));

module.exports = dbConnection;
