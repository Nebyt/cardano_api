import Joi from 'joi'

export const accountStateSchema = Joi.object({
  remainingAmount: Joi.string().pattern(/\d+/).required(),
  remainingNonSpendableAmount: Joi.string().pattern(/\d+/).required(),
  rewards: Joi.string().pattern(/\d+/).required(),
  withdrawals: Joi.string().pattern(/\d+/).required(),
  poolOperator: Joi.string().allow(null).required(),
  isRewardsOff: Joi.boolean().required(),
})
