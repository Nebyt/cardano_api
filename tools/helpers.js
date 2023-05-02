import {PREPROD_URL, PREVIEW_URL, POOL_1_PREPROD_HASH, POOL_1_PREVIEW_HASH} from '../constants.js'

export const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }
    return value
  }
}

export const getTestnetURL = () => {
  const testnet = process.env.TESTNET
  if (testnet === 'preprod') {
    return PREPROD_URL
  } else if (testnet === 'preview') {
    return PREVIEW_URL
  } else {
    throw new Error('Unknown testnet network')
  }
}

export const isPreprod = () => {
  const testnet = process.env.TESTNET
  if (testnet === 'preprod') {
    return true
  } else if (testnet === 'preview') {
    return false
  } else {
    throw new Error('Unknown testnet network')
  }
}

export const getPoolBasedOnNetwork = () => {
  if (isPreprod()) {
    return POOL_1_PREPROD_HASH
  }
  return POOL_1_PREVIEW_HASH
}
