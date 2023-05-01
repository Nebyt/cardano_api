import {PREPROD_URL, PREVIEW_URL} from '../constants.js'

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
    console.log('--> preprod')
    return PREPROD_URL
  } else if (testnet === 'preview') {
    console.log('--> preview')
    return PREVIEW_URL
  } else {
    throw new Error('Unknown testnet network')
  }
}
