const mongoose = require("mongoose");

const promotionSchema = mongoose.Schema({
  title_ar: {
    type: String,
    required: [true, "promotion in arabic is required"],
  },
  title_en: {
    type: String,
    required: [true, "promotion in english is required"],
  },
  percentage: {
    type: Number,
    required: [true, "percentage is required"],
  },
});
const Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;
