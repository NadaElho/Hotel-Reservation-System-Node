const mongoose = require("mongoose");

const amenitySchema = mongoose.Schema({
  name_ar: {
    type: String,
    required: [true, "name in arabic is required"],
  },
  name_en: {
    type: String,
    required: [true, "name in english is required"],
  },
  icon:{
    type: String,
    required: [true, 'icon is required']
  }
});
const Amenity = mongoose.model("Amenity", amenitySchema);
module.exports = Amenity;
