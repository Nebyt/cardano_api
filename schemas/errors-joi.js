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

export const addressesNotIterable = Joi.object({
  error: Joi.object({
    response: Joi.string().valid('addresses is not iterable'),
  }),
})

export const cypherQueryEmptyString = Joi.object({
  error: Joi.object({
    response: Joi.string().valid('Cypher query is expected to be a non-empty string.'),
  }),
})

export const wrongTypeOfArgument = Joi.object({
  error: Joi.object({
    response: Joi.string().pattern(/^The "\w+" argument must be of type \w+\. Received .+$/)
  })
})
