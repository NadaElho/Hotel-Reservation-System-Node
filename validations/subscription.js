const joi = require('joi')

const validateNewSubscription = (subscription) => {
  const schema = joi.object({
    name_ar:joi.string().required(),
    name_en:joi.string().required(),
    subscriptionAdvantageIds: joi.array().items(joi.string()),
    percentage: joi.number().required(),
    price: joi.number().required(),
    currency: joi.string(),

  })
  return schema.validate(subscription)
}

const validateUpdateSubscription = (subscription) => {
  const schema = joi.object({
    name_ar:joi.string(),
    name_en:joi.string(),
    subscriptionAdvantageIds: joi.array(),
    percentage: joi.number(),
    price: joi.number(),
    currency: joi.string(),
  })
  return schema.validate(subscription)
}

module.exports = { validateNewSubscription, validateUpdateSubscription }
