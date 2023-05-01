import Joi from 'joi'

export const bestBlockSchema = Joi.object({
  epoch: Joi.number().required(),
  slot: Joi.number().required(),
  globalSlot: Joi.number().required(),
  hash: Joi.string().hex(),
  height: Joi.number().required(),
})
