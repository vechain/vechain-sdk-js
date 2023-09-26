import { randomBytes } from 'crypto'
import { ERRORS } from '../utils/errors'
// eslint-disable-next-line
const EC = require('elliptic').ec

// Cureve algorithm
const curve = new EC('secp256k1')

// Max value
const N = Buffer.from('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 'hex')

// Zero value
const ZERO = Buffer.alloc(32, 0)

/**
   * Validate message hash
   * @param hash of message
   * @returns if message hash is valid or not
   */
function isValidMessageHash (hash: Buffer): boolean {
  return Buffer.isBuffer(hash) && hash.length === 32
}

/**
   * Verify if private key is valid
   * @returns If private key is valid or not
   */
function isValidPrivateKey (key: Buffer): boolean {
  return Buffer.isBuffer(key) &&
        key.length === 32 &&
        !key.equals(ZERO) &&
        key.compare(N) < 0
}

/**
   * Generate a random secure private key
   */
function generate (entropy?: () => Buffer): Buffer {
  entropy = entropy ?? (() => randomBytes(32))
  for (; ;) {
    const privKey = entropy()
    if (isValidPrivateKey(privKey)) {
      return privKey
    }
  }
}

/**
   * Generate public key from private key
   *
   * @param privateKey Private key used to genrate public key
   * @returns Public key
   */
function derive (privateKey: Buffer): Buffer {
  if (!isValidPrivateKey(privateKey)) {
    throw new Error(ERRORS.SECP256K1.INVALID_PRIVATE_KEY)
  }
  const keyPair = curve.keyFromPrivate(privateKey)
  return Buffer.from(keyPair.getPublic().encode('array', false))
}

/**
   * sign a message using elliptic curve algorithm on the curve secp256k1
   * @param msgHash hash of message
   * @param privKey serialized private key
   */
function sign (msgHash: Buffer, privKey: Buffer): Buffer {
  if (!isValidMessageHash(msgHash)) {
    throw new Error(ERRORS.SECP256K1.INVALID_MESSAGE_HASH)
  }

  if (!isValidPrivateKey(privKey)) {
    throw new Error(ERRORS.SECP256K1.INVALID_PRIVATE_KEY)
  }

  const keyPair = curve.keyFromPrivate(privKey)
  const sig = keyPair.sign(msgHash, { canonical: true })

  const r = Buffer.from(sig.r.toArray('be', 32))
  const s = Buffer.from(sig.s.toArray('be', 32))

  return Buffer.concat([r, s, Buffer.from([sig.recoveryParam])])
}

/**
   * recovery signature to public key
   * @param msgHash hash of message
   * @param sig signature
   */
function recover (msgHash: Buffer, sig: Buffer): Buffer {
  if (!isValidMessageHash(msgHash)) {
    throw new Error(ERRORS.SECP256K1.INVALID_MESSAGE_HASH)
  }
  if (!Buffer.isBuffer(sig) || sig.length !== 65) {
    throw new Error(ERRORS.SECP256K1.INVALID_SIGNATURE)
  }
  const recovery = sig[64]
  if (recovery !== 0 && recovery !== 1) {
    throw new Error(ERRORS.SECP256K1.INVALID_SIGNATURE_RECOVERY)
  }

  const rCopy = Uint8Array.from(sig)
  const r = rCopy.slice(0, 32)

  const sCopy = Uint8Array.from(sig)
  const s = sCopy.slice(32, 64)

  return Buffer.from(curve.recoverPubKey(
    msgHash,
    { r, s },
    recovery
  ).encode('array', false))
}

export const secp256k1 = { isValidMessageHash, isValidPrivateKey, generate, derive, sign, recover }
