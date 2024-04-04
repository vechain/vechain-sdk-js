import { BN } from 'bn.js';
import { Hex, SIGNATURE_LENGTH, ZERO_BUFFER } from '../utils';
import { assert, SECP256K1 } from '@vechain/sdk-errors';
import { randomBytes as _randomBytes } from '@noble/hashes/utils';
import { secp256k1 as ec } from '@noble/curves/secp256k1';
import {
    assertIsValidPrivateKey,
    assertIsValidSecp256k1MessageHash
} from '../assertions';

/**
 * Biggest value of private key
 * @internal
 */
const PRIVATE_KEY_MAX_VALUE = Buffer.from(
    'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
    'hex'
);

/**
 * Compresses a public key.
 *
 * Security audit function.
 * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 *
 * @param {Uint8Array} publicKey - The uncompressed public key.
 *
 * @returns {Uint8Array} - The compressed public key.
 *
 * @see inflatePublicKey
 *
 */
function compressPublicKey(publicKey: Uint8Array): Uint8Array {
    const prefix = publicKey.at(0);
    if (prefix === 4) {
        // To compress.
        const x = publicKey.slice(1, 33);
        const y = publicKey.slice(33, 65);
        const isYOdd = y[y.length - 1] & 1;
        // Prefix with 0x02 if Y coordinate is even, 0x03 if odd.
        return Buffer.concat([Buffer.from([2 + isYOdd]), x]);
    } else {
        // Compressed.
        return publicKey;
    }
}

/**
 * Derives a public key from a given private key.
 *
 * @param {Buffer} privateKey - The private key used to derive the public key.
 * @param {boolean} [isCompressed=true] - Boolean indicating whether the derived public key should be compressed or not.
 * @returns {Buffer} - The derived public key as a Buffer object.
 *
 * @throws{InvalidSecp256k1PrivateKeyError} if `privateKey` is invalid.
 *
 * @see assertIsValidPrivateKey
 */
function derivePublicKey(
    privateKey: Buffer,
    isCompressed: boolean = true
): Buffer {
    assertIsValidPrivateKey(
        'secp256k1.derivePublicKey',
        privateKey,
        isValidPrivateKey
    );
    const publicKey = ec.getPublicKey(privateKey, isCompressed);
    return Buffer.from(publicKey);
}

/**
 * Inflates a compressed or uncompressed public key.
 *
 * Security audit function.
 * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 *
 * @param {Uint8Array} publicKey - The compressed or uncompressed public key to inflate.
 *
 * @return {Uint8Array} - The inflated uncompressed public key.
 *
 * @see compressPublicKey
 */
function inflatePublicKey(publicKey: Uint8Array): Uint8Array {
    const prefix = publicKey.at(0);
    if (prefix !== 4) {
        // To inflate.
        const x = publicKey.slice(0, 33);
        const p = ec.ProjectivePoint.fromAffine(
            ec.ProjectivePoint.fromHex(Hex.of(x)).toAffine()
        );
        return p.toRawBytes(false);
    } else {
        // Inflated.
        return publicKey;
    }
}

/**
 * Generates a new private key.
 *
 * Security audit function.
 * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 *
 * @returns {Buffer} The newly generated private key as a buffer.
 */
function generatePrivateKey(): Buffer {
    return Buffer.from(ec.utils.randomPrivateKey());
}

/**
 * Check if the given hash is a valid message hash.
 *
 * @param {Buffer} hash - The hash of the message to validate.
 * @return {boolean} - Returns `true` if the hash is a valid message hash,
 * otherwise returns `false`.
 */
function isValidMessageHash(hash: Buffer): boolean {
    return Buffer.isBuffer(hash) && hash.length === 32;
}

/**
 * Checks if the given private key is valid.
 *
 * @param {Buffer} privateKey - The private key to be checked.
 * @return {boolean} - Returns `true` if the private key is 32 bytes long
 * in the range between 0 and {@link PRIVATE_KEY_MAX_VALUE} excluded,
 * otherwise `false`.
 */
function isValidPrivateKey(privateKey: Buffer): boolean {
    return (
        Buffer.isBuffer(privateKey) &&
        privateKey.length === 32 &&
        !privateKey.equals(ZERO_BUFFER(32)) &&
        privateKey.compare(PRIVATE_KEY_MAX_VALUE) < 0
    );
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

/**
 * Recovers public key from a given message hash and signature.
 *
 * @param {Buffer} messageHash - The message hash to recover the public key from.
 * @param {Buffer} sig - The signature of the message.
 * @returns {Buffer} - The recovered public key.
 *
 * @throws{InvalidSecp256k1MessageHashError} - If the message hash is invalid.
 * @throws{InvalidSecp256k1SignatureError} - If the signature is invalid.
 * @throws{InvalidSecp256k1SignatureRecoveryError} - If the signature can't be used to recovery the public key.
 *
 * @see assertIsValidSecp256k1MessageHash
 */
function recover(messageHash: Buffer, sig: Buffer): Buffer {
    assertIsValidSecp256k1MessageHash(
        'secp256k1.recover',
        messageHash,
        isValidMessageHash
    );

    assert(
        'secp256k1.recover',
        Buffer.isBuffer(sig) && sig.length === SIGNATURE_LENGTH,
        SECP256K1.INVALID_SECP256k1_SIGNATURE,
        'Invalid signature given as input. Length must be exactly 65 bytes.',
        { sig }
    );

    const recovery = sig[64];
    assert(
        'secp256k1.recover',
        recovery === 0 || recovery === 1,
        SECP256K1.INVALID_SECP256k1_SIGNATURE_RECOVERY,
        'Invalid signature recovery value. Signature bytes at position 64 must be 0 or 1.',
        { recovery }
    );

    return Buffer.from(
        ec.Signature.fromCompact(Uint8Array.from(sig).slice(0, 64))
            .addRecoveryBit(recovery)
            .recoverPublicKey(messageHash)
            .toRawBytes(false)
    );
}

/**
 * Signs a message hash using a private key.
 *
 * Security audit function.
 * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 *
 * @param {Buffer} messageHash - The message hash to be signed.
 * @param {Buffer} privateKey - The private key to use for signing.
 * @returns {Buffer} - The signature of the message hash.
 *
 * @throws {InvalidSecp256k1MessageHashError} - If the message hash is invalid.
 * @throws {InvalidSecp256k1PrivateKeyError} - If the private key is invalid.
 *
 * @see assertIsValidSecp256k1MessageHash
 * @see assertIsValidPrivateKey
 */
function sign(messageHash: Buffer, privateKey: Buffer): Buffer {
    assertIsValidSecp256k1MessageHash(
        'secp256k1.sign',
        messageHash,
        isValidMessageHash
    );
    assertIsValidPrivateKey('secp256k1.sign', privateKey, isValidPrivateKey);
    const sig = ec.sign(messageHash, privateKey);
    const r = Buffer.from(new BN(sig.r.toString()).toArray('be', 32));
    const s = Buffer.from(new BN(sig.s.toString()).toArray('be', 32));
    return Buffer.concat([r, s, Buffer.from([sig.recovery])]);
}

export const secp256k1 = {
    compressPublicKey,
    derivePublicKey,
    generatePrivateKey,
    inflatePublicKey,
    isValidMessageHash,
    isValidPrivateKey,
    recover,
    randomBytes,
    sign
};
