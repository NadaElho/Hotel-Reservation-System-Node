const joi = require('joi')
const ValidateAddAmenity = (amenity) => {
  const schema = joi.object({
    name_ar: joi.string().required(),
    name_en: joi.string().required(),
    description_en: joi.string().required(),
    description_ar: joi.string().required(),
    images: joi.array().items(joi.string()).min(1),
  })
  return schema.validate(amenity)
}

const ValidateEditAmenity = (amenity) => {
  const schema = joi.object({
    name_ar: joi.string(),
    name_en: joi.string(),
    description_en: joi.string(),
    description_ar: joi.string(),
    images: joi.array().items(joi.string()),

  })
  return schema.validate(amenity)
}

module.exports = { ValidateAddAmenity, ValidateEditAmenity }
