const joi = require('joi')

const validateNewSubscriptionAdvantage = (subscriptionAdvantage) => {
  const schema = joi.object({
    name_ar:joi.string().required(),
    name_en:joi.string().required(),
  })
  return schema.validate(subscriptionAdvantage)
}

const validateUpdateSubscriptionAdvantage = (subscriptionAdvantage) => {
  const schema = joi.object({
    name_ar:joi.string(),
    name_en:joi.string(),
  })
  return schema.validate(subscriptionAdvantage)
}

module.exports = { validateNewSubscriptionAdvantage, validateUpdateSubscriptionAdvantage }
