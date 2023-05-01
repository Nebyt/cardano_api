import {getCircularReplacer} from './tools/helpers.js'
import {
  getRootKeyFromMnemonic,
  getAccountKey,
  getStakeKey,
  getExternalAddrFromPrivateKey,
  getInternalAddrFromPrivateKey,
} from './tools/wallet-tools.js'
import {getBestBlock, getUtxos, getPoolInfo} from './api-requests.js'
import {POOL_APEX_CARDANO_HASH} from './constants.js'

// Getting PK and the base address
const privateKey = getRootKeyFromMnemonic(
  'cover alter diary typical before decade rail siren boring draw virus logic evil pitch what',
)
const accountKey = getAccountKey(privateKey)
const stakeKey = getStakeKey(accountKey)

// Requesting info
const bestblock = await getBestBlock()
console.log(`Best block response: ${JSON.stringify(bestblock, getCircularReplacer(), 2)}`)

// Requesting UTXOs for external address
const externalAddress = getExternalAddrFromPrivateKey(privateKey, stakeKey)
const utxosForExternalAddress = await getUtxos(externalAddress, bestblock.hash)
console.log(`Utxos for external address: ${JSON.stringify(utxosForExternalAddress, getCircularReplacer(), 2)}`)

// Requesting UTXOs for internal address
const internalAddress = getInternalAddrFromPrivateKey(privateKey, stakeKey)
const utxosForInternalAddress = await getUtxos(internalAddress, bestblock.hash)
console.log(`Utxos for internal address: ${JSON.stringify(utxosForInternalAddress, getCircularReplacer(), 2)}`)

// Calculating total amount in UTXOs on internal address
const total = utxosForInternalAddress.reduce((accumulator, utxo) => accumulator + parseInt(utxo.amount, 10), 0)
const parsedTotal = total / 1000000
console.log(`Total: ${parsedTotal}`)

// Requesting a pool info
const poolHashes = [POOL_APEX_CARDANO_HASH]
const poolInfo = await getPoolInfo(poolHashes)
console.log(`Pools info: ${JSON.stringify(poolInfo, getCircularReplacer(), 2)}`)
