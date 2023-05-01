import CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs'
import {generateMnemonic, mnemonicToEntropy} from 'bip39'
import {ChainDerivations} from '../constants.js'

/** Generate a random mnemonic based on 160-bits of entropy (15 words) */
export const generateWalletRecoveryPhrase = async () => {
  return generateMnemonic(160)
}

export const getExternalAddrFromPrivateKey = (privateKey, stakeKey) => {
  const accKey = getAccountKey(privateKey)
  const extKey = getExternalPrivateKey(accKey)

  const publicKey = extKey.to_public()
  console.log(`Public external key: ${publicKey.to_bech32()}`)

  const addr = CardanoWasm.BaseAddress.new(
    CardanoWasm.NetworkInfo.testnet_preprod().network_id(), // change it, necessary to switch between preprod and preview
    CardanoWasm.StakeCredential.from_keyhash(publicKey.to_raw_key().hash()),
    CardanoWasm.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
  ).to_address()

  console.log(`External address: ${addr.to_bech32()}`)

  return addr
}

export const getInternalAddrFromPrivateKey = (privateKey, stakeKey) => {
  const accKey = getAccountKey(privateKey)
  const internalKey = getInternalPrivateKey(accKey)

  const publicKey = internalKey.to_public()
  console.log(`Public internal key: ${internalKey.to_bech32()}`)

  const addr = CardanoWasm.BaseAddress.new(
    CardanoWasm.NetworkInfo.testnet_preprod().network_id(), // change it, necessary to switch between preprod and preview
    CardanoWasm.StakeCredential.from_keyhash(publicKey.to_raw_key().hash()),
    CardanoWasm.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
  ).to_address()

  console.log(`Internal address: ${addr.to_bech32()}`)

  return addr
}

export const getRootKeyFromMnemonic = (mnemonic) => {
  const bip39Entropy = mnemonicToEntropy(mnemonic)
  const EMPTY_PASSWORD = Buffer.from('')
  const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(Buffer.from(bip39Entropy, 'hex'), EMPTY_PASSWORD)

  return rootKey
}

export const getAccountKey = (rootKey) => {
  return rootKey.derive(harden(1852)).derive(harden(1815)).derive(harden(0))
}

export const getStakeKey = (accKey) => {
  return accKey.derive(ChainDerivations.CHIMERIC_ACCOUNT).derive(0).to_public()
}

export const getExternalPrivateKey = (accKey, index = 0) => {
  return accKey.derive(ChainDerivations.EXTERNAL).derive(index)
}

export const getInternalPrivateKey = (accKey, index = 263) => {
  return accKey.derive(ChainDerivations.INTERNAL).derive(index)
}

export const harden = (num) => {
  return 0x80000000 + num
}
