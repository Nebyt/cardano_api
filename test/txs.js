import supertest from 'supertest'
import {assert} from 'chai'
import Joi from 'joi'
import {getTestnetURL} from '../tools/helpers.js'

const request = supertest(getTestnetURL())

describe('Txs API', function () {
  // POST /v2/txs/utxoDiffSincePoint {addresses: [...], afterBestblocks: [...], diffLimit: 50, untilBlockHash: "..."}
  // POST /v2/txs/history {addresses: [...], after: {block: "...", tx: "..."}, untilBlock: "..."}
  // POST /txs/utxoForAddresses {addresses: Array<string>} byron addresses, bech32 address, bech32 stake addresses or addr_vkh
  // POST /v2/txs/utxoAtPoint {
  //     addresses: Array<string>,
  //     page: number,
  //     pageSize: number,
  //     referenceBlockHash?: string // the hash of the block
  // } byron addresses, bech32 address, bech32 stake addresses or addr_vkh
  // POST /txs/utxoSumForAddresses {addresses: Array<string>}
  // POST /v2/txs/get {txHashes: string[]}
  // POST /txs/signed {signedTx: string,} base64 encoding of the transaction
  // POST /tx/status {"txHashes": string[]}
  // GET /txs/io/:tx_hash
  // GET /txs/io/:tx_hash/o/:index
  // POST /v2.1/txs/summaries
})
