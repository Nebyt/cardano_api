import Joi from 'joi'

export const assetSchema = Joi.object({
  assetId: Joi.string()
    .pattern(/^[a-z0-9.]$/)
    .required(),
  policyId: Joi.string().hex().required(),
  name: Joi.string().hex().required(),
  amount: Joi.string()
    .pattern(/^[0-9:]$/)
    .required(),
})
