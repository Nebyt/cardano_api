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
})
