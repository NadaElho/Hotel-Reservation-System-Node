const { mongoose } = require("mongoose");
const roomSchema = mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "Rome must have Hotel Id"],
  },
  title_ar: {
    type: String,
    required: [true, "Room must have Arabic title"],
  },
  title_en: {
    type: String,
    required: [true, "Room must have English title"],
  },
  roomNumber: {
    type: Number,
    required: [true, "Room must have Room Number"],
    unique: [true, "Room number must be unique"],
  },
  description_en: {
    type: String,
    required: [true, "Room must have English Description"],
  },
  description_ar: {
    type: String,
    required: [true, "Room must have Arabic Description"],
  },
  amenitiesIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
    },
  ],
  promotionId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
    },
  ],
  roomTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomType",
    required: [true, " Room must have Room Type Id"],
  },
  price: {
    type: Number,
    required: [true, "Room must have Price"],
  },
  currency: {
    type: String,
    default: "$",
  },
  images: [
    {
      type: String,
      required: [true, "Room must have Image"],
    },
  ],
});
  ratingAvg: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
})

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
