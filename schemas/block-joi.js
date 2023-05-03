import Joi from 'joi'

export const blockSchema = Joi.object({
  epoch: Joi.number().integer().required(),
  slot: Joi.number().integer().required(),
  globalSlot: Joi.number().integer().required(),
  hash: Joi.string().hex(),
  height: Joi.number().integer().required(),
})
