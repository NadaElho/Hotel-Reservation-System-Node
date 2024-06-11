const mongoose = require('mongoose')

const hotelSchema = mongoose.Schema({
  name_ar: {
    type: String,
    required: [true, "name in arabic is required"],
  },
  name_en: {
    type: String,
    required: [true, "name in english is required"],
  },
  address_ar: {
    type: String,
    required: [true, "address in arabic is required"],
  },
  address_en: {
    type: String,
    required: [true, "address in english is required"],
  },
  images: [
    {
      type: String,
      required: [true, "images is required"],
    },
  ],
  description_ar: {
    type: String,
    required: [true, "description in arabic is required"],
  },
  description_en: {
    type: String,
    required: [true, "description in english is required"],
  },
  phoneNumber: [
    {
      type: String,
      required: [true, "PhoneNumber is required"],
    },
  ],
  longitude:{
    type:String
  },
  latitude:{
    type:String
  }
});
const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
