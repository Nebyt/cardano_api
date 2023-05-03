import Joi from 'joi'

export const serverStatusSchema = Joi.object({
  parallelSync: Joi.boolean().required(),
  isServerOk: Joi.boolean().required(),
  isMaintenance: Joi.boolean().required(),
  serverTime: Joi.number().integer().required(),
  isQueueOnline: Joi.boolean().required(),
})
