import Joi from 'joi'
import {assetSchema} from './asset-joi.js'

export const utxoSchema = Joi.object({
  utxo_id: Joi.string()
    .pattern(/^[a-z0-9:]+$/)
    .required(),
  tx_hash: Joi.string().hex().required(),
  tx_index: Joi.number().integer().required(),
  receiver: Joi.string()
    .pattern(/^addr[a-z0-9_]+$/)
    .required(),
  amount: Joi.string().pattern(/^\d+$/).required(),
  dataHash: Joi.string().allow(null),
  assets: Joi.array().items(assetSchema).empty(Joi.array().length(0)),
  block_num: Joi.number().integer().required(),
})

export const utxosSchema = Joi.array().items(utxoSchema).empty(Joi.array().length(0))
