import { PRIVATE_KEY_MAX_VALUE, SIGNATURE_LENGTH, ZERO_BUFFER } from '../utils';
import { ec as EC } from 'elliptic';
import { assert, SECP256K1 } from '@vechain/sdk-errors';
import {
    assertIsValidPrivateKey,
    assertIsValidSecp256k1MessageHash
} from '../assertions';

import { BN } from 'bn.js';
import { secp256k1 as _secp256k1 } from '@noble/curves/secp256k1';
import { randomBytes as _randomBytes } from '@noble/hashes/utils';

// Curve algorithm.
const curve = new EC('secp256k1');

/**
 * Validate message hash.
 * @param hash of message.
 * @returns if message hash is valid or not.
 */
function isValidMessageHash(hash: Buffer): boolean {
    return Buffer.isBuffer(hash) && hash.length === 32;
}

/**
 * Verify if private key is valid.
 * @returns If private key is valid or not.
 */
function isValidPrivateKey(key: Buffer): boolean {
    return (
        Buffer.isBuffer(key) &&
        key.length === 32 &&
        !key.equals(ZERO_BUFFER(32)) &&
        key.compare(PRIVATE_KEY_MAX_VALUE) < 0
    );
}

/**
 * Generate private key using elliptic curve algorithm on the curve secp256k1.
 * @returns Private key generated.
 */
function generatePrivateKey(): Buffer {
    return Buffer.from(_secp256k1.utils.randomPrivateKey());
}

/**
 * Derive public key from private key using elliptic curve algorithm secp256k1.
 *
 * @throws{InvalidSecp256k1PrivateKeyError}
 * @param privateKey - private key to derive public key from.
 * @returns Public key derived from private key.
 */
function derivePublicKey(privateKey: Buffer): Buffer {
    assertIsValidPrivateKey('derivePublicKey', privateKey, isValidPrivateKey);
    const publicKey = _secp256k1.getPublicKey(privateKey, false);
    return Buffer.from(publicKey);
}

/**
 * Sign a message using elliptic curve algorithm secp256k1.
 *
 * @throws{InvalidSecp256k1PrivateKeyError, InvalidSecp256k1MessageHashError}
 * @param messageHash hash of message.
 * @param privateKey serialized private key.
 */
function sign(messageHash: Buffer, privateKey: Buffer): Buffer {
    assertIsValidSecp256k1MessageHash('sign', messageHash, isValidMessageHash);
    assertIsValidPrivateKey('sign', privateKey, isValidPrivateKey);
    const sig = _secp256k1.sign(messageHash, privateKey);
    const r = Buffer.from(new BN(sig.r.toString()).toArray('be', 32));
    const s = Buffer.from(new BN(sig.s.toString()).toArray('be', 32));
    return Buffer.concat([r, s, Buffer.from([sig.recovery])]);
}

/**
 * Recover the public key from its signature and messahe hash.
 *
 * @throws{InvalidSecp256k1MessageHashError, InvalidSecp256k1SignatureError, InvalidSecp256k1SignatureRecoveryError}
 * @param messageHash hash of message
 * @param sig signature
 */
function recover(messageHash: Buffer, sig: Buffer): Buffer {
    assertIsValidSecp256k1MessageHash(
        'recover',
        messageHash,
        isValidMessageHash
    );

    assert(
        'recover',
        Buffer.isBuffer(sig) && sig.length === SIGNATURE_LENGTH,
        SECP256K1.INVALID_SECP256k1_SIGNATURE,
        'Invalid signature given as input. Length must be exactly 65 bytes.',
        { sig }
    );

    const recovery = sig[64];
    assert(
        'recover',
        recovery === 0 || recovery === 1,
        SECP256K1.INVALID_SECP256k1_SIGNATURE_RECOVERY,
        'Invalid signature recovery value. Signature bytes at position 64 must be 0 or 1.',
        { recovery }
    );

    return Buffer.from(
        _secp256k1.Signature.fromCompact(Uint8Array.from(sig).slice(0, 64))
            .addRecoveryBit(recovery)
            .recoverPublicKey(messageHash)
            .toRawBytes(false)
    );
}

/**
 * Convert extended public key to array public key (compressed or uncompressed)
 *
 * @param extendedPublicKey extended public key.
 * @param compact if public key should be compressed or not.
 * @returns array public key.
 */
function extendedPublicKeyToArray(
    extendedPublicKey: Buffer,
    compact: boolean
): number[] {
    return curve.keyFromPublic(extendedPublicKey).getPublic(compact, 'array');
}

/**
 * Generates random bytes of specified length.
 *
 * The function relays on [noble-hashes](https://github.com/paulmillr/noble-hashes/blob/main/src/utils.ts)
 * functionality to delegate the OS to generate the random sequence according the host hardware.
 *
 * @param {number} bytesLength - The length of the random bytes to generate.
 * @return {Buffer} - The generated random bytes as a Buffer object.
 * @throws Error with `crypto.getRandomValues must be defined`
 * message if no hardware for random generation is
 * available at runtime.
 */
function randomBytes(bytesLength?: number | undefined): Buffer {
    return Buffer.from(_randomBytes(bytesLength));
}

export const secp256k1 = {
    isValidMessageHash,
    isValidPrivateKey,
    generatePrivateKey,
    derivePublicKey,
    sign,
    recover,
    extendedPublicKeyToArray,
    randomBytes
};
