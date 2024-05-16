const joi = require('joi')

const validateNewReservation = (reservation) => {
  const schema = joi.object({
    userId: joi.string().required(),
    roomId: joi.string().required(),
    status: joi.string().required(),
    checkIn: joi.date().required(),
    checkOut: joi.date().required(),
  })
  return schema.validate(reservation)
}

const validateUpdateReservation = (reservation) => {
  const schema = joi.object({
    userId: joi.string(),
    roomId: joi.string(),
    status: joi.string(),
    checkIn: joi.date(),
    checkOut: joi.date(),
  })
  return schema.validate(reservation)
}

module.exports = { validateNewReservation, validateUpdateReservation }
