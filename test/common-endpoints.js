import supertest from 'supertest'
import {assert} from 'chai'
import Joi from 'joi'
import {getTestnetURL} from '../tools/helpers.js'
import {fundInfoSchema} from '../schemas/fundInfo-joi.js'
import {pricesSchema} from '../schemas/prices-joi.js'
import {poolInfoSchema} from '../schemas/poolInfo-joi.js'
import {POOL_APEX_CARDANO_HASH} from '../constants.js'

const request = supertest(getTestnetURL())

describe('Common API', () => {
  it('GET /v0/catalyst/fundInfo', () => {
    return request
      .get('/v0/catalyst/fundInfo')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, fundInfoSchema)
      })
  })
  it('GET /price/ADA/current', () => {
    return request
      .get('/price/ADA/current')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, pricesSchema)
      })
  })
  it('POST /pool/info', () => {
    const payload = {poolIds: [POOL_APEX_CARDANO_HASH]}
    return request
      .post('/pool/info')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body[POOL_APEX_CARDANO_HASH], poolInfoSchema)
      })
  })
})
