import Joi from 'joi'
import {blockSchema} from './block-joi.js'

export const tipStatusSchema = Joi.object({
  bestBlock: blockSchema.required(),
  safeBlock: blockSchema.required(),
})

const referenceSchema = Joi.object({
  reference: Joi.object({
    lastFoundSafeBlock: Joi.string().hex().required(),
    lastFoundBestBlock: Joi.string().hex().required(),
  }),
})

export const tipStatusPostSchema = tipStatusSchema.concat(referenceSchema)
