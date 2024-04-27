require("dotenv").config();
require("./db");
var cors = require("cors");

const express = require("express");
const app = express();

app.use(cors());

app.listen(3000, () => {
    console.log(`listening on port ${3000} ...`);
  });