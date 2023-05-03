import supertest from 'supertest'
import {assert} from 'chai'
import Joi from 'joi'
import {getPoolBasedOnNetwork, getTestnetURL} from '../tools/helpers.js'
import {fundInfoSchema} from '../schemas/fundInfo-joi.js'
import {currentPriceSchema, timestampPricesSchema} from '../schemas/prices-joi.js'
import {poolInfoSchema} from '../schemas/poolInfo-joi.js'
import {serverStatusSchema} from '../schemas/serverStatus-joi.js'

const request = supertest(getTestnetURL())

describe('Common API', () => {
  it('GET /v0/catalyst/fundInfo', function () {
    return request
      .get('/v0/catalyst/fundInfo')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, fundInfoSchema)
      })
  })

  it('GET /price/ADA/current', function () {
    return request
      .get('/price/ADA/current')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, currentPriceSchema)
      })
  })

  const currentTime = Date.now()
  it(`GET /price/ADA/${currentTime}`, function () {
    return request
      .get(`/price/ADA/${currentTime}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, timestampPricesSchema)
      })
  })

  it('POST /pool/info', function () {
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

  it('GET /status', function () {
    const curTime = Date.now()
    return request
      .get('/status')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, serverStatusSchema)
        assert.isAtLeast(res.body.serverTime, curTime)
      })
  })
})
