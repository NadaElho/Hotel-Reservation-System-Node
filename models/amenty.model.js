const mongoose = require("mongoose");

const amentySchema = mongoose.Schema({
  name_ar: {
    type: String,
    required: true,
  },
  name_en: {
    type: String,
    required: true,
  },
  icon:{
    type: String,
    required: true
  }
});
const amenty = mongoose.model("Amenty", amentySchema);
module.exports = amenty;
