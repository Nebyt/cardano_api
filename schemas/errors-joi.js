import Joi from 'joi'

export const noAddressesSchema = Joi.object({
  error: Joi.object({
    response: Joi.string().valid('no addresses.'),
  }),
})

export const invalidHexadecimalDigitSchema = Joi.object({
    error: Joi.object({
        response: Joi.string().pattern(/^invalid hexadecimal digit:.+"$/)
    })
})
