const joi = require("joi");
const ValidateAddHotel = (hotel) => {
  const schema = joi.object({
    name_ar: joi.string().required(),
    name_en: joi.string().required(),
    address_ar: joi.string().required(),
    address_en: joi.string().required(),
    description_ar: joi.string().required(),
    description_en: joi.string().required(),
    phoneNumber: joi.string().required().max(11)
  });
  return schema.validate(hotel);
};

const ValidateEditHotel = (hotel) => {
  const schema = joi.object({
    name_ar: joi.string(),
    name_en: joi.string(),
    address_ar: joi.string(),
    address_en: joi.string(),
    description_ar: joi.string(),
    description_en: joi.string(),
    phoneNumber: joi.string().max(11)
  });
  return schema.validate(hotel);
};

module.exports = { ValidateAddHotel, ValidateEditHotel };
