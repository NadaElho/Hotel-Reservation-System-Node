const joi = require('joi')
const ValidateAddPromotion= (promotion) => {
  const schema = joi.object({
    title_ar: joi.string().required(),
    title_en: joi.string().required(),
    percentage: joi.number().required(),
  })
  return schema.validate(promotion)
}

const ValidateEditPromotion = (promotion) => {
  const schema = joi.object({
    title_ar: joi.string(),
    title_en: joi.string(),
    percentage: joi.number()
  });
  return schema.validate(promotion);
};

module.exports = { ValidateAddPromotion, ValidateEditPromotion }
