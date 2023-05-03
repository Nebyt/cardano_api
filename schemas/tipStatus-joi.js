import Joi from 'joi'
import {blockSchema} from './block-joi.js'

export const tipStatusSchema = Joi.object({
  bestBlock: blockSchema,
  safeBlock: blockSchema,
})
