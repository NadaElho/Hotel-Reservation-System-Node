const joi = require('joi')

const validateNewROOm = (room) => {
  const schema = joi.object({
    hotelId: joi.string().required(),
    roomTypeId: joi.string().required(),
    amentiesIds: joi.array().items(joi.string()),
    roomNumber: joi.number().required(),
    description_en: joi.string().required(),
    description_ar: joi.string().required(),
    price: joi.number().required(),
    currency: joi.string().required(),
    images: joi.array().items(joi.string()).required(),
  })
  return schema.validate(room)
}

const validateUpdateRoom = (room) => {
  const schema = joi.object({
    hotelId: joi.string(),
    roomTypeId: joi.string(),
    amentiesIds: joi.array(),
    roomNumber: joi.number(),
    description_en: joi.string(),
    description_ar: joi.string(),
    price: joi.number(),
    currency: joi.string(),
    images: joi.array().items(joi.string()),
  })
  return schema.validate(room)
}

module.exports = { validateNewROOm, validateUpdateRoom }
