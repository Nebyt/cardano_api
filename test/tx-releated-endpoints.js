import supertest from 'supertest'
import {assert} from 'chai'
import Joi from 'joi'
import {
  generateWalletRecoveryPhrase,
  getRootKeyFromMnemonic,
  getAccountKey,
  getStakeKey,
  getRewardAddr,
} from '../tools/wallet-tools.js'
import {WALLET_DELEGATED} from '../constants.js'
import {getTestnetURL} from '../tools/helpers.js'
import {accountStateSchema} from '../schemas/accountState-joi.js'
import {bestBlockSchema} from '../schemas/bestblock-joi.js'
import {invalidHexadecimalDigitSchema, noAddressesSchema} from '../schemas/errors-joi.js'

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
        Joi.assert(res.body, bestBlockSchema)
      })
  })
  it('POST /account/state, new empty wallet', async function () {
    const newRecoveryPhrase = await generateWalletRecoveryPhrase()
    const privateKey = getRootKeyFromMnemonic(newRecoveryPhrase)
    const accountKey = getAccountKey(privateKey)
    const stakeKey = getStakeKey(accountKey)
    const rewardAddress = getRewardAddr(stakeKey)

    // In case the payload is incorrect, e.g. the addresses are not in hex or it is not array the error 500 is returned
    const rewardAddrHex = rewardAddress.to_hex()
    const payload = {addresses: [rewardAddrHex]}
    return request
      .post('/account/state')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        assert.isNull(res.body[rewardAddrHex])
      })
  })

  it('POST /account/state, delegated wallet', function () {
    const privateKey = getRootKeyFromMnemonic(WALLET_DELEGATED)
    const accountKey = getAccountKey(privateKey)
    const stakeKey = getStakeKey(accountKey)
    const rewardAddress = getRewardAddr(stakeKey)

    // In case the payload is incorrect, e.g. the addresses are not in hex or it is not array the error 500 is returned
    const rewardAddrHex = rewardAddress.to_hex()
    const payload = {addresses: [rewardAddrHex]}
    return request
      .post('/account/state')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body[rewardAddrHex], accountStateSchema)
      })
  })

  it('POST /account/state, wrong payload, no payload', function () {
    return request
      .post('/account/state')
      .expect('Content-Type', /json/)
      .expect(500)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, noAddressesSchema)
      })
  })

  it('POST /account/state, wrong payload, no addresses', function () {
    const payload = {}
    return request
      .post('/account/state')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(500)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, noAddressesSchema)
      })
  })

  it('POST /account/state, wrong payload, bech32 instead of hex', async function () {
    const newRecoveryPhrase = await generateWalletRecoveryPhrase()
    const privateKey = getRootKeyFromMnemonic(newRecoveryPhrase)
    const accountKey = getAccountKey(privateKey)
    const stakeKey = getStakeKey(accountKey)
    const rewardAddress = getRewardAddr(stakeKey)

    const rewardAddrHex = rewardAddress.to_bech32()
    const payload = {addresses: [rewardAddrHex]}
    return request
      .post('/account/state')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(500)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, invalidHexadecimalDigitSchema)
      })
  })
})

// POST /account/rewardHistory {addresses:[...]}
// POST /v2/addresses/filterUsed {addresses:[...]}
// POST /v2/tipStatus {reference: {bestBlocks: [...]}}
// GET /v2/tipStatus
// POST /v2/txs/utxoDiffSincePoint {addresses: [...], afterBestblocks: [...], diffLimit: 50, untilBlockHash: "..."}
// POST /v2/txs/history {addresses: [...], after: {block: "...", tx: "..."}, untilBlock: "..."}
