import CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs'
import {generateMnemonic, mnemonicToEntropy} from 'bip39'

/** Generate a random mnemonic based on 160-bits of entropy (15 words) */
export const generateWalletRecoveryPhrase = async () => {
  return generateMnemonic(160)
}

export const getAddrFromPrivateKey = (privateKey, stakeKey) => {
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
  return accKey.derive(2).derive(0).to_public()
}

export const harden = (num) => {
  return 0x80000000 + num
}
