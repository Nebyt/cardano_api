import Joi from 'joi'

export const rewardHistoryItemSchema = Joi.object({
  epoch: Joi.number().integer().required(),
  spendableEpoch: Joi.number().integer().required(),
  reward: Joi.string().pattern(/\d+/).required(),
  poolHash: Joi.string().hex(),
})

export const rewardHistorySchema = Joi.array().items(rewardHistoryItemSchema).empty(Joi.array().length(0))
