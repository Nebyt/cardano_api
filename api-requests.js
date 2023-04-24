import axios from 'axios'
import {PREPROD_URL} from './constants.js'

export const getUtxos = async (addr, lastBlock) => {
  return (
    await axios.post(`${PREPROD_URL}/txs/utxoForAddresses`, {
      addresses: [addr.to_bech32()],
      untilBlock: lastBlock,
    })
  ).data
}

export const getBestBlock = async () => {
  return (await axios.get(`${PREPROD_URL}/v2/bestblock`)).data
}
