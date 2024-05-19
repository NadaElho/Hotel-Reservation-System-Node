const joi = require('joi')
const ValidateAddHotel = (hotel) => {
  const schema = joi.object({
    name_ar: joi.string().required(),
    name_en: joi.string().required(),
    address_ar: joi.string().required(),
    address_en: joi.string().required(),
    images: joi.array().items(joi.string()).min(1),
    description_ar: joi.string().required(),
    description_en: joi.string().required(),
    phoneNumber: joi.array().items(joi.string().max(11)).min(1),
  })
  return schema.validate(hotel)
}

const ValidateEditHotel = (hotel) => {
  const schema = joi.object({
    name_ar: joi.string(),
    name_en: joi.string(),
    address_ar: joi.string(),
    address_en: joi.string(),
    images: joi.array().items(joi.string()).min(1),
    description_ar: joi.string(),
    description_en: joi.string(),
    phoneNumber: joi.array().items(joi.string().max(11)).min(1),
  });
  return schema.validate(hotel);
};

module.exports = { ValidateAddHotel, ValidateEditHotel }
