import supertest from 'supertest'
import {assert} from 'chai'
import Joi from 'joi'
import {WALLET_DELEGATED} from '../constants.js'
import {getTestnetURL} from '../tools/helpers.js'
import {generateWalletRecoveryPhrase, getRewardAddr, getWalletKeys} from '../tools/wallet-tools.js'
import {accountStateSchema} from '../schemas/accountState-joi.js'
import {invalidHexadecimalDigitSchema, noAddressesSchema} from '../schemas/errors-joi.js'
import {rewardHistorySchema} from '../schemas/rewardHistory-joi.js'

const request = supertest(getTestnetURL())

const getNewWalletRewardAddr = async () => {
  const newRecoveryPhrase = await generateWalletRecoveryPhrase()
  const {stakeKey} = getWalletKeys(newRecoveryPhrase)

  return getRewardAddr(stakeKey)
}

const getRewardAddrFromRecoveryPhrase = (recoveryPhraseString) => {
  const {stakeKey} = getWalletKeys(recoveryPhraseString)

  return getRewardAddr(stakeKey)
}

describe('Account API', function () {
  it('POST /account/state, new empty wallet', async function () {
    const rewardAddress = await getNewWalletRewardAddr()

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
    const rewardAddress = getRewardAddrFromRecoveryPhrase(WALLET_DELEGATED)

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
    const rewardAddress = await getNewWalletRewardAddr()

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

  it('POST /account/rewardHistory, new empty wallet', async function () {
    const rewardAddress = await getNewWalletRewardAddr()

    // In case the payload is incorrect, e.g. the addresses are not in hex or it is not array the error 500 is returned
    const rewardAddrHex = rewardAddress.to_hex()
    const payload = {addresses: [rewardAddrHex]}

    return request
      .post('/account/rewardHistory')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body[rewardAddrHex], rewardHistorySchema)
      })
  })

  it('POST /account/rewardHistory, delegated wallet, hex', function () {
    const rewardAddress = getRewardAddrFromRecoveryPhrase(WALLET_DELEGATED)

    // In case the payload is incorrect, e.g. the addresses are not in hex or it is not array the error 500 is returned
    const rewardAddrHex = rewardAddress.to_hex()
    const payload = {addresses: [rewardAddrHex]}

    return request
      .post('/account/rewardHistory')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body[rewardAddrHex], rewardHistorySchema)
      })
  })

  it('POST /account/rewardHistory, delegated wallet, bech32', function () {
    const rewardAddress = getRewardAddrFromRecoveryPhrase(WALLET_DELEGATED)

    // In case the payload is incorrect, e.g. the addresses are not in hex or it is not array the error 500 is returned
    const rewardAddrHex = rewardAddress.to_bech32()
    const payload = {addresses: [rewardAddrHex]}

    return request
      .post('/account/rewardHistory')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body[rewardAddrHex], rewardHistorySchema)
      })
  })

  it('POST /account/rewardHistory, wrong payload, no payload', function () {
    return request
      .post('/account/rewardHistory')
      .expect('Content-Type', /json/)
      .expect(500)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, noAddressesSchema)
      })
  })

  it('POST /account/rewardHistory, wrong payload, no addresses', function () {
    const payload = {}
    return request
      .post('/account/rewardHistory')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(500)
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, noAddressesSchema)
      })
  })
})
