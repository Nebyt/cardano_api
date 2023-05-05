import supertest from 'supertest'
import {assert} from 'chai'
import Joi from 'joi'
import {getTestnetURL} from '../tools/helpers.js'
import {blockSchema} from '../schemas/block-joi.js'
import {tipStatusSchema, tipStatusPostSchema} from '../schemas/tipStatus-joi.js'
import {getExternalAddrFromPrivateKey, getVerifiedKeyHashBech, getWalletKeys} from '../tools/wallet-tools.js'
import {WALLET_DELEGATED} from '../constants.js'
import {addressesNotIterable, cypherQueryEmptyString, wrongTypeOfArgument} from '../schemas/errors-joi.js'
import {
  bech32TestnetAddressesArraySchema,
  hexAddressesArraySchema,
  vkhAddressesArraySchema,
} from '../schemas/addresses-joi.js'

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

  it('POST /v2/addresses/filterUsed, addr_vkh', function () {
    const walletKeys = getWalletKeys(WALLET_DELEGATED)
    const payloadArray = []
    for (let i = 0; i < 50; i++) {
      const extAddr = getExternalAddrFromPrivateKey(walletKeys.privateKey, walletKeys.stakeKey, i)
      const vkhAddr = getVerifiedKeyHashBech(extAddr)
      payloadArray.push(vkhAddr)
    }
    const payload = {addresses: payloadArray}

    return request
      .post('/v2/addresses/filterUsed')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        assert.isArray(res.body)
        assert.lengthOf(res.body, 1)
        Joi.assert(res.body, vkhAddressesArraySchema)
        assert.includeMembers(payloadArray, res.body)
      })
  })

  it('POST /v2/addresses/filterUsed, bech32', function () {
    const walletKeys = getWalletKeys(WALLET_DELEGATED)
    const payloadArray = []
    for (let i = 0; i < 50; i++) {
      const extAddr = getExternalAddrFromPrivateKey(walletKeys.privateKey, walletKeys.stakeKey, i)
      const bech32Addr = extAddr.to_bech32()
      payloadArray.push(bech32Addr)
    }
    const payload = {addresses: payloadArray}

    return request
      .post('/v2/addresses/filterUsed')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        assert.isArray(res.body)
        assert.lengthOf(res.body, 1)
        Joi.assert(res.body, bech32TestnetAddressesArraySchema)
        assert.includeMembers(payloadArray, res.body)
      })
  })

  it('POST /v2/addresses/filterUsed, hex', function () {
    const walletKeys = getWalletKeys(WALLET_DELEGATED)
    const payloadArray = []
    for (let i = 0; i < 50; i++) {
      const extAddr = getExternalAddrFromPrivateKey(walletKeys.privateKey, walletKeys.stakeKey, i)
      const hexAddr = extAddr.to_hex()
      payloadArray.push(hexAddr)
    }
    const payload = {addresses: payloadArray}

    return request
      .post('/v2/addresses/filterUsed')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        assert.isArray(res.body)
        assert.lengthOf(res.body, 1)
        Joi.assert(res.body, hexAddressesArraySchema)
        assert.includeMembers(payloadArray, res.body)
      })
  })

  it('POST /v2/addresses/filterUsed, mixed, vkh + bech32', function () {
    const walletKeys = getWalletKeys(WALLET_DELEGATED)
    const payloadArray = []
    const extAddr = getExternalAddrFromPrivateKey(walletKeys.privateKey, walletKeys.stakeKey, 0)
    const vkhAddr = getVerifiedKeyHashBech(extAddr)
    const bech32Addr = extAddr.to_bech32()
    payloadArray.push(vkhAddr, bech32Addr)

    const payload = {addresses: payloadArray}

    return request
      .post('/v2/addresses/filterUsed')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        assert.isArray(res.body)
        assert.lengthOf(res.body, payloadArray.length)
        assert.includeMembers(payloadArray, res.body)
      })
  })

  // The test fails. The combination of `bech32` and `hex` doesn't work, only hex address are returned
  it('POST /v2/addresses/filterUsed, mixed, bech32 + hex', function () {
    const walletKeys = getWalletKeys(WALLET_DELEGATED)
    const payloadArray = []
    const extAddr = getExternalAddrFromPrivateKey(walletKeys.privateKey, walletKeys.stakeKey, 0)
    const bech32Addr = extAddr.to_bech32()
    const hexAddr = extAddr.to_hex()
    payloadArray.push(bech32Addr, hexAddr)

    const payload = {addresses: payloadArray}

    return request
      .post('/v2/addresses/filterUsed')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        assert.isArray(res.body)
        assert.lengthOf(res.body, payloadArray.length)
        assert.includeMembers(payloadArray, res.body)
      })
  })

  it('POST /v2/addresses/filterUsed, mixed, vkh + hex', function () {
    const walletKeys = getWalletKeys(WALLET_DELEGATED)
    const payloadArray = []
    const extAddr = getExternalAddrFromPrivateKey(walletKeys.privateKey, walletKeys.stakeKey, 0)
    const vkhAddr = getVerifiedKeyHashBech(extAddr)
    const hexAddr = extAddr.to_hex()
    payloadArray.push(vkhAddr, hexAddr)

    const payload = {addresses: payloadArray}

    return request
      .post('/v2/addresses/filterUsed')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        assert.isArray(res.body)
        assert.lengthOf(res.body, payloadArray.length)
        assert.includeMembers(payloadArray, res.body)
      })
  })

  // The test fails. The combination of `bech32` and `hex` doesn't work, only hex address are returned
  it('POST /v2/addresses/filterUsed, mixed, vkh + bech32 + hex', function () {
    const walletKeys = getWalletKeys(WALLET_DELEGATED)
    const payloadArray = []
    const extAddr = getExternalAddrFromPrivateKey(walletKeys.privateKey, walletKeys.stakeKey, 0)
    const vkhAddr = getVerifiedKeyHashBech(extAddr)
    const bech32Addr = extAddr.to_bech32()
    const hexAddr = extAddr.to_hex()
    payloadArray.push(vkhAddr, bech32Addr, hexAddr)

    const payload = {addresses: payloadArray}

    return request
      .post('/v2/addresses/filterUsed')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        assert.isNotEmpty(res.body)
        assert.isArray(res.body)
        assert.lengthOf(res.body, payloadArray.length)
        assert.includeMembers(payloadArray, res.body)
      })
  })

  it('POST /v2/addresses/filterUsed, wrong payload, empty object', function () {
    const payload = {}

    return request
      .post('/v2/addresses/filterUsed')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(500) // Should be 400
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, addressesNotIterable)
      })
  })

  it('POST /v2/addresses/filterUsed, wrong payload, empty addresses array', function () {
    const payload = {addresses: []}

    return request
      .post('/v2/addresses/filterUsed')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(500) // Should be 400
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, cypherQueryEmptyString)
      })
  })

  it('POST /v2/addresses/filterUsed, wrong payload, malformed addresses', function () {
    const payload = {addresses: ['11111111111111111111111', '0101001010100101010100101010']}

    return request
      .post('/v2/addresses/filterUsed')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(500) // Should be 400
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, cypherQueryEmptyString) // wrong error response
      })
  })

  it('POST /v2/addresses/filterUsed, wrong payload, wrong data types, int', function () {
    const payload = {addresses: [111111]}

    return request
      .post('/v2/addresses/filterUsed')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(500) // Should be 400
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, wrongTypeOfArgument)
      })
  })

  it('POST /v2/addresses/filterUsed, wrong payload, wrong data types, object', function () {
    const payload = {addresses: [{a: 1}]}

    return request
      .post('/v2/addresses/filterUsed')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(500) // Should be 400
      .then((res) => {
        assert.isNotEmpty(res.body)
        Joi.assert(res.body, wrongTypeOfArgument)
      })
  })
})
