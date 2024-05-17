const joi = require('joi')

const validateNewRoomType = (roomType) => {
  const schema = joi.object({
    type_en: joi.string().required(),
    type_ar: joi.string().required(),
  })
  return schema.validate(roomType)
}

const validateUpdateRoomType = (roomType) => {
  const schema = joi.object({
    type_en: joi.string(),
    type_ar: joi.string(),
  })
  return schema.validate(roomType)
}

module.exports = { validateNewRoomType, validateUpdateRoomType }
