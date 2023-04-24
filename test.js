import supertest from 'supertest'
import {assert} from 'chai'
import {PREPROD_URL, PREVIEW_URL} from './constants.js'
import {getTestnetURL} from './helpers.js'

const request = supertest(getTestnetURL())

describe('Common API', () => {
  it('GET /v2/bestblock', () => {
    // Make a GET request to the bestblock route
    return request
      .get('/v2/bestblock')
      .expect(200)
      .then((res) => {
        // assert data being return to not be empty
        assert.isNotEmpty(res.body)
      })
  })
  // POST /account/state {addresses:[...]}
  // POST /account/rewardHistory {addresses:[...]}
  // POST /pool/info {poolIDs: ["8a77ce4ffc0c690419675aa5396df9a38c9cd20e36483d2d2465ce86"]}
  // GET /v0/catalyst/fundInfo
  // POST /v2/addresses/filterUsed {addresses:[...]}
  // POST /v2/tipStatus {reference: {bestBlocks: [...]}}
  // GET /v2/tipStatus
  // POST /v2/txs/utxoDiffSincePoint {addresses: [...], afterBestblocks: [...], diffLimit: 50, untilBlockHash: "..."}
  // POST /v2/txs/history {addresses: [...], after: {block: "...", tx: "..."}, untilBlock: "..."}
})
