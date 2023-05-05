import CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs'
import {generateMnemonic, mnemonicToEntropy} from 'bip39'
import {ChainDerivations, Bech32Prefix} from '../constants.js'

/** Generate a random mnemonic based on 160-bits of entropy (15 words) */
export const generateWalletRecoveryPhrase = () => {
  return generateMnemonic(160)
}

export const getExternalAddrFromPrivateKey = (privateKey, stakeKey, index = 0) => {
  const accKey = getAccountKey(privateKey)
  const extKey = getExternalPrivateKey(accKey, index)

  const publicKey = extKey.to_public()

  const addr = CardanoWasm.BaseAddress.new(
    CardanoWasm.NetworkInfo.testnet_preprod().network_id(), // change it, necessary to switch between preprod and preview
    CardanoWasm.StakeCredential.from_keyhash(publicKey.to_raw_key().hash()),
    CardanoWasm.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
  ).to_address()

  return addr
}

export const getInternalAddrFromPrivateKey = (privateKey, stakeKey, index = 0) => {
  const accKey = getAccountKey(privateKey)
  const internalKey = getInternalPrivateKey(accKey, index)

  const publicKey = internalKey.to_public()

  const addr = CardanoWasm.BaseAddress.new(
    CardanoWasm.NetworkInfo.testnet_preprod().network_id(), // change it, necessary to switch between preprod and preview
    CardanoWasm.StakeCredential.from_keyhash(publicKey.to_raw_key().hash()),
    CardanoWasm.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
  ).to_address()

  return addr
}

export const getRewardAddr = (stakeKey) => {
  const rewardAddr = CardanoWasm.RewardAddress.new(
    CardanoWasm.NetworkInfo.testnet_preprod().network_id(), // change it, necessary to switch between preprod and preview
    CardanoWasm.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
  ).to_address()

  return rewardAddr
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

export const getInternalPrivateKey = (accKey, index = 0) => {
  return accKey.derive(ChainDerivations.INTERNAL).derive(index)
}

export const harden = (num) => {
  return 0x80000000 + num
}

export const getWalletKeys = (recoveryPhraseString) => {
  const privateKey = getRootKeyFromMnemonic(recoveryPhraseString)
  const accountKey = getAccountKey(privateKey)
  const stakeKey = getStakeKey(accountKey)

  return {privateKey, accountKey, stakeKey}
}

export const getVerifiedKeyHashBech = (addressObject) => {
  const keyHash = CardanoWasm.BaseAddress.from_address(addressObject).payment_cred().to_keyhash()

  return keyHash.to_bech32(Bech32Prefix.PAYMENT_KEY_HASH)
}
