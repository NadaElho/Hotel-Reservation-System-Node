const joi = require('joi')

const validateNewUser = (user) => {
  const schema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email({
        tlds: {
            allow: false
        }
    }).required(),
    gender:joi.string(),
    phoneNumber:joi.string().regex(/^[0-9]{10}$/),
    role:joi.string().required(),
    password:joi.string().required(),
    images: joi.array().items(joi.string()),
  })
  return schema.validate(user)
}

const validateUpdateUser = (user) => {
  const schema = joi.object({
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string().email({
        tlds: {
            allow: false
        }
    }),
    gender:joi.string(),
    phoneNumber:joi.string().regex(/^[0-9]{10}$/),
    role:joi.string(),
    password:joi.string(),
    images: joi.array().items(joi.string()),
  })
  return schema.validate(user)
}

module.exports = { validateNewUser, validateUpdateUser }
