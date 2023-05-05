import Joi from 'joi'

export const bech32TestnetAddressSchema = Joi.string().pattern(/^addr_test1[a-z0-9]+$/)
export const vkhAddressSchema = Joi.string().pattern(/^addr_vkh[a-z0-9]+$/)
export const hexAddressSchema = Joi.string().hex()
export const bech32TestnetAddressesArraySchema = Joi.array().items(bech32TestnetAddressSchema)
export const vkhAddressesArraySchema = Joi.array().items(vkhAddressSchema)
export const hexAddressesArraySchema = Joi.array().items(hexAddressSchema)