import supertest from 'supertest'
import {assert} from 'chai'
import Joi from 'joi'
import {getPoolBasedOnNetwork, getTestnetURL} from '../tools/helpers.js'
import {fundInfoSchema} from '../schemas/fundInfo-joi.js'
import {pricesSchema} from '../schemas/prices-joi.js'
import {poolInfoSchema} from '../schemas/poolInfo-joi.js'

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
    const poolHash = getPoolBasedOnNetwork()
    const payload = {poolIds: [poolHash]}
    return request
      .post('/pool/info')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body[poolHash], poolInfoSchema)
      })
  })
})
