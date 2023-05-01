import Joi from 'joi'

export const pricesSchema = Joi.object({
  ticker: Joi.object({
    from: Joi.string()
      .pattern(/^ADA$/)
      .required(),
    timestamp: Joi.date().timestamp().required(),
    signature: Joi.string()
      .pattern(/^[a-z0-9]+$/)
      .required(),
    prices: Joi.object({
      BRL: Joi.number().required(),
      BTC: Joi.number().required(),
      CNY: Joi.number().required(),
      ETH: Joi.number().required(),
      EUR: Joi.number().required(),
      JPY: Joi.number().required(),
      KRW: Joi.number().required(),
      USD: Joi.number().required(),
    }),
  }),
  error: Joi.string().allow(null),
})
