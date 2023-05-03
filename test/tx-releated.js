import supertest from 'supertest'
import {assert} from 'chai'
import Joi from 'joi'
import {getTestnetURL} from '../tools/helpers.js'
import {blockSchema} from '../schemas/block-joi.js'
import {tipStatusSchema} from '../schemas/tipStatus-joi.js'

const request = supertest(getTestnetURL())

describe('Tx related API', function () {
  it('GET /v2/bestblock', function () {
    // Make a GET request to the bestblock route
    return request
      .get('/v2/bestblock')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        // assert data being return to not be empty
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, blockSchema)
      })
  })

  it('GET /v2/tipStatus', function () {
    // Make a GET request to the bestblock route
    return request
      .get('/v2/tipStatus')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, tipStatusSchema)
      })
  })
})

// POST /v2/addresses/filterUsed {addresses:[...]}
// POST /v2/tipStatus {reference: {bestBlocks: [...]}}
// POST /v2/txs/utxoDiffSincePoint {addresses: [...], afterBestblocks: [...], diffLimit: 50, untilBlockHash: "..."}
// POST /v2/txs/history {addresses: [...], after: {block: "...", tx: "..."}, untilBlock: "..."}
