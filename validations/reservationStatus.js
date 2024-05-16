const joi = require('joi')

const validateNewReservationStatus= (reservationStatus) => {
  const schema = joi.object({
    name_en: joi.string().required(),
    name_ar: joi.string().required(),
  })
  return schema.validate(reservationStatus)
}

const validateUpdateReservationStatus= (reservationStatus) => {
  const schema = joi.object({
    name_en: joi.string(),
    name_ar: joi.string(),
  })
  return schema.validate(reservationStatus)
}

module.exports = { validateNewReservationStatus, validateUpdateReservationStatus }
