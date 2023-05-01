import {getCircularReplacer} from './tools/helpers.js'
import {
  getRootKeyFromMnemonic,
  getAccountKey,
  getStakeKey,
  getExternalAddrFromPrivateKey,
  getInternalAddrFromPrivateKey,
} from './tools/wallet-tools.js'
import {getBestBlock, getUtxos} from './api-requests.js'

// Getting PK and the base address
const privateKey = getRootKeyFromMnemonic(
  'cover alter diary typical before decade rail siren boring draw virus logic evil pitch what',
)
const accountKey = getAccountKey(privateKey)
const stakeKey = getStakeKey(accountKey)
// const externalAddress = getExternalAddrFromPrivateKey(privateKey, stakeKey)
const internalAddress = getInternalAddrFromPrivateKey(privateKey, stakeKey)

// Requesting info
const bestblock = await getBestBlock()
console.log(`Best block response: ${JSON.stringify(bestblock, getCircularReplacer(), 2)}`)
// const utxosForAddress = await getUtxos(externalAddress, bestblock.hash)
const utxosForAddress = await getUtxos(internalAddress, bestblock.hash)
console.log(`Utxos for address: ${JSON.stringify(utxosForAddress, getCircularReplacer(), 2)}`)
const total = utxosForAddress.reduce((accumulator, utxo) => accumulator + parseInt(utxo.amount, 10), 0)
const parsedTotal = total / 1000000
console.log(`Total: ${parsedTotal}`)
