import Joi from 'joi'

const tickerBodySchema = Joi.object({
  from: Joi.string().valid('ADA').required(),
  timestamp: Joi.date().timestamp().required(),
  signature: Joi.string().hex().required(),
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
})

export const currentPriceSchema = Joi.object({
  ticker: tickerBodySchema,
  error: Joi.string().allow(null),
})

export const timestampPricesSchema = Joi.object({
  tickers: Joi.array().items(tickerBodySchema),
  error: Joi.string().allow(null),
})
