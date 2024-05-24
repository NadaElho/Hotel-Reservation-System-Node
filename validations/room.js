const joi = require('joi')

const validateNewROOm = (room) => {
  const schema = joi.object({
    hotelId: joi.string().required(),
    title_ar:joi.string().required(),
    title_en:joi.string().required(),
    roomTypeId: joi.string().required(),
    amenitiesIds: joi.array().items(joi.string()),
    roomNumber: joi.number().required(),
    description_en: joi.string().required(),
    description_ar: joi.string().required(),
    price: joi.number().required(),
    currency: joi.string(),
    images:joi.array().items(joi.string()).min(1).required(),
  })
  return schema.validate(room)
}

const validateUpdateRoom = (room) => {
  const schema = joi.object({
    hotelId: joi.string(),
    title_ar:joi.string(),
    title_en:joi.string(),
    roomTypeId: joi.string(),
    amenitiesIds: joi.array(),
    roomNumber: joi.number().unique(),
    description_en: joi.string(),
    description_ar: joi.string(),
    price: joi.number(),
    currency: joi.string(),
    images: joi.array().items(joi.string()).min(1),
  })
  return schema.validate(room)
}

module.exports = { validateNewROOm, validateUpdateRoom }
