import {getCircularReplacer} from './helpers.js'
import {getRootKeyFromMnemonic, getAccountKey, getStakeKey, getAddrFromPrivateKey} from './wallet-tools.js'
import {getBestBlock, getUtxos} from './api-requests.js'

// Getting PK and the base address
const privateKey = getRootKeyFromMnemonic(
  'cover alter diary typical before decade rail siren boring draw virus logic evil pitch what',
)
const accountKey = getAccountKey(privateKey)
const stakeKey = getStakeKey(accountKey)
const baseAddress = getAddrFromPrivateKey(privateKey, stakeKey)

// Requesting info
const bestblock = await getBestBlock()
console.log(`Best block response: ${JSON.stringify(bestblock, getCircularReplacer())}`)
const utxosForAddress = await getUtxos(baseAddress, bestblock.hash)
console.log(`Utxos for address: ${JSON.stringify(utxosForAddress, getCircularReplacer())}`)
