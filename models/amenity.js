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
  description_en: 
    {
      type: String,
      required: [true, "description in english is required"],
    },
  
  description_ar: 
    {
      type: String,
      required: [true, "description in arabic is required"],
    },
  
    images: [
    {
      type: String,
      required: [true, "images is required"],
    },
  ],
});

const Amenity = mongoose.model("Amenity", amenitySchema);
module.exports = Amenity;
