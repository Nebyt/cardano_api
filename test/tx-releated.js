import supertest from 'supertest'
import {assert} from 'chai'
import Joi from 'joi'
import {getTestnetURL} from '../tools/helpers.js'
import {blockSchema} from '../schemas/block-joi.js'
import {tipStatusSchema, tipStatusPostSchema} from '../schemas/tipStatus-joi.js'

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

  it('POST /v2/tipStatus', async function () {
    const safeBlockHash = (await request.get('/v2/tipStatus')).body.safeBlock.hash
    const payload = {
      reference: {
        bestBlocks: [safeBlockHash],
      },
    }

    return request
      .post('/v2/tipStatus')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, tipStatusPostSchema)
      })
  })
})

// POST /v2/addresses/filterUsed {addresses:[...]}
