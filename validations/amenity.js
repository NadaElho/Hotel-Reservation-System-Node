const joi = require('joi')
const ValidateAddAmenity = (amenity) => {
  const schema = joi.object({
    name_ar: joi.string().required(),
    name_en: joi.string().required(),
  })
  return schema.validate(amenity)
}

const ValidateEditAmenity = (amenity) => {
  const schema = joi.object({
    name_ar: joi.string(),
    name_en: joi.string(),
  })
  return schema.validate(amenity)
}

module.exports = { ValidateAddAmenity, ValidateEditAmenity }