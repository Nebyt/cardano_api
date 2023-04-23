import CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs'
import axios from 'axios'
import cbor from 'cbor'
import {mnemonicToEntropy} from 'bip39'

// Use example from Mecanice Cuniculus to get privet key from a seed phrasel

const PREPROD_URL = 'https://preprod-backend.yoroiwallet.com/api/'
const PREVIEW_URL = 'https://preview-backend.emurgornd.com/api/'

const getUtxos = async (addr, lastBlock) => {
  return (await axios.post(`${PREPROD_URL}txs/utxoForAddresses`, {
    addresses: [addr.to_bech32()],
    untilBlock: lastBlock
  })).data
}

const getBestBlock = async () => {
  return (await axios.get(`${PREPROD_URL}v2/bestblock`)).data
}

const getAddrFromPrivateKey = (privateKey, stakeKey) => {
  const publicKey = privateKey.to_public()
  console.log(`Public key: ${publicKey.to_bech32()}`)

  const addr = CardanoWasm.BaseAddress.new(
    CardanoWasm.NetworkInfo.testnet_preprod().network_id(),
    CardanoWasm.StakeCredential.from_keyhash(publicKey.to_raw_key().hash()),
    CardanoWasm.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
  ).to_address()

  console.log(`Base address: ${addr.to_bech32()}`)

  return addr
}

const getRootKeyFromMnemonic = (mnemonic) => {
  const bip39Entropy = mnemonicToEntropy(mnemonic)
  const EMPTY_PASSWORD = Buffer.from('')
  const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(Buffer.from(bip39Entropy, 'hex'), EMPTY_PASSWORD)

  return rootKey
}

const getAccountKey = (rootKey) => {
  return rootKey.derive(harden(1852)).derive(harden(1815)).derive(harden(0))
}

const getStakeKey = (accKey) => {
  return accKey.derive(2).derive(0).to_public()
}

const harden = (num) => {
  return 0x80000000 + num
}

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

// Checking
const privateKey = getRootKeyFromMnemonic(
  'cover alter diary typical before decade rail siren boring draw virus logic evil pitch what',
)
const accountKey = getAccountKey(privateKey)
const stakeKey = getStakeKey(accountKey)
const baseAddress = getAddrFromPrivateKey(privateKey, stakeKey)
const bestblock = await getBestBlock()
console.log(`Best block response: ${JSON.stringify(bestblock, getCircularReplacer())}`)
const utxosForAddress = await getUtxos(baseAddress, bestblock.hash)
console.log(`Utxos for address: ${JSON.stringify(utxosForAddress, getCircularReplacer())}`)
