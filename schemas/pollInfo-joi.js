import Joi from 'joi'

const servInfoSchema = Joi.object({
  ipv4: Joi.string()
    .ip({
      version: 'ipv4',
    })
    .allow(null)
    .required(),
  ipv6: Joi.string()
    .ip({
      version: 'ipv6',
    })
    .allow(null)
    .required(),
  dnsName: Joi.string().domain().allow(null).required(),
  dnsSrvName: Joi.string().domain().allow(null).required(),
  port: Joi.string().pattern(/^\d{4,5}$/),
})

const poolHistoryParamsSchema = Joi.object({
  operator: Joi.string().hex(),
  vrfKeyHash: Joi.string().hex(),
  pledge: Joi.string().pattern(/^\d+$/),
  cost: Joi.string().pattern(/^\d+$/),
  margin: Joi.number().required(),
  rewardAccount: Joi.string().hex(),
  poolOwners: Joi.array().items(Joi.string().hex()),
  relays: Joi.array().items(servInfoSchema),
  poolMetadata: Joi.object({
    url: Joi.string().uri(),
    metadataHash: Joi.string().hex(),
  }),
})

const poolInfoHistorySchema = Joi.object({
  epoch: Joi.number().integer().required(),
  slot: Joi.number().integer().required(),
  tx_ordinal: Joi.number().integer().required(),
  cert_ordinal: Joi.number().integer().required(),
  payload: Joi.object({
    kind: Joi.string().valid('PoolRegistration'),
    certIndex: Joi.number().required(),
    poolParams: poolHistoryParamsSchema,
  }).required(),
})

export const poolInfoSchema = Joi.object({
  info: Joi.object(),
  history: Joi.array().items(poolInfoHistorySchema),
})
