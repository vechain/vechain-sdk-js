import * as utils from '@noble/curves/abstract/utils';
import { Hex, SIGNATURE_LENGTH } from '../utils';
import { assert, SECP256K1 } from '@vechain/sdk-errors';
import { randomBytes as _randomBytes } from '@noble/hashes/utils';
import { secp256k1 as ec } from '@noble/curves/secp256k1';
import {
    assertIsValidPrivateKey,
    assertIsValidSecp256k1MessageHash
} from '../assertions';

/**
 * Compresses a public key.
 *
 * Security audit function.
 * * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 * * [utils](https://github.com/paulmillr/noble-curves?tab=readme-ov-file#utils-useful-utilities)
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
        return utils.concatBytes(Uint8Array.of(2 + isYOdd), x);
    } else {
        // Compressed.
        return publicKey;
    }
}

/**
 * Derives a public key from a given private key.
 *
 * Security audit function.
 * * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 *
 * @param {Uint8Array} privateKey - The private key used to derive the public key.
 * @param {boolean} [isCompressed=true] - Boolean indicating whether the derived public key should be compressed or not.
 * @returns {Uint8Array} - The derived public key as a Uint8Array object.
 *
 * @throws{InvalidSecp256k1PrivateKeyError} if `privateKey` is invalid.
 *
 * @see assertIsValidPrivateKey
 */
function derivePublicKey(
    privateKey: Uint8Array,
    isCompressed: boolean = true
): Uint8Array {
    assertIsValidPrivateKey(
        'secp256k1.derivePublicKey',
        privateKey,
        isValidPrivateKey
    );
    return ec.getPublicKey(privateKey, isCompressed);
}

/**
 * Generates a new private key.
 *
 * Security audit function.
 * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 *
 * @returns {Uint8Array} The newly generated private key as a buffer.
 */
function generatePrivateKey(): Uint8Array {
    return ec.utils.randomPrivateKey();
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
 * Check if the given hash is a valid message hash.
 *
 * Security audit function.
 * * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 * * [utils](https://github.com/paulmillr/noble-curves?tab=readme-ov-file#utils-useful-utilities)
 *
 * @param {Uint8Array} hash - The hash of the message to validate.
 * @return {boolean} - Returns `true` if the hash is a valid message hash,
 * otherwise returns `false`.
 */
function isValidMessageHash(hash: Uint8Array): boolean {
    return hash.length === 32;
}

/**
 * Checks if the given private key is valid.
 *
 * Security audit function.
 * * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 *
 * @param {Uint8Array} privateKey - The private key to be checked.
 * @return {boolean} - Returns `true` if the private key is 32 bytes long
 * in the range between 0 and {@link PRIVATE_KEY_MAX_VALUE} excluded,
 * otherwise `false`.
 */
function isValidPrivateKey(privateKey: Uint8Array): boolean {
    return ec.utils.isValidPrivateKey(privateKey);
}

/**
 * Generates random bytes of specified length.
 *
 * The function relays on [noble-hashes](https://github.com/paulmillr/noble-hashes/blob/main/src/utils.ts)
 * functionality to delegate the OS to generate the random sequence according the host hardware.
 *
 * Security audit function.
 * * [_randomBytes](https://github.com/paulmillr/noble-curves?tab=readme-ov-file#utils-useful-utilities)
 *
 * @param {number} bytesLength - The length of the random bytes to generate.
 * @return {Uint8Array} - The generated random bytes as a Uint8Array object.
 * @throws Error with `crypto.getRandomValues must be defined`
 * message if no hardware for random generation is
 * available at runtime.
 */
function randomBytes(bytesLength?: number | undefined): Uint8Array {
    return _randomBytes(bytesLength);
}

/**
 * Recovers public key from a given message hash and signature.
 *
 * Security audit function.
 * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 *
 * @param {Uint8Array} messageHash - The message hash to recover the public key from.
 * @param {Uint8Array} sig - The signature of the message.
 * @returns {Uint8Array} - The recovered public key.
 *
 * @throws{InvalidSecp256k1MessageHashError} - If the message hash is invalid.
 * @throws{InvalidSecp256k1SignatureError} - If the signature is invalid.
 * @throws{InvalidSecp256k1SignatureRecoveryError} - If the signature can't be used to recovery the public key.
 *
 * @see assertIsValidSecp256k1MessageHash
 */
function recover(messageHash: Uint8Array, sig: Uint8Array): Uint8Array {
    assertIsValidSecp256k1MessageHash(
        'secp256k1.recover',
        messageHash,
        isValidMessageHash
    );

    assert(
        'secp256k1.recover',
        sig.length === SIGNATURE_LENGTH,
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

    return ec.Signature.fromCompact(sig.slice(0, 64))
        .addRecoveryBit(recovery)
        .recoverPublicKey(messageHash)
        .toRawBytes(false);
}

/**
 * Signs a message hash using a private key.
 *
 * Security audit function.
 * * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 * * [utils](https://github.com/paulmillr/noble-curves?tab=readme-ov-file#utils-useful-utilities)
 *
 * @param {Uint8Array} messageHash - The message hash to be signed.
 * @param {Uint8Array} privateKey - The private key to use for signing.
 * @returns {Uint8Array} - The signature of the message hash.
 *
 * @throws {InvalidSecp256k1MessageHashError} - If the message hash is invalid.
 * @throws {InvalidSecp256k1PrivateKeyError} - If the private key is invalid.
 *
 * @see assertIsValidSecp256k1MessageHash
 * @see assertIsValidPrivateKey
 */
function sign(messageHash: Uint8Array, privateKey: Uint8Array): Uint8Array {
    assertIsValidSecp256k1MessageHash(
        'secp256k1.sign',
        messageHash,
        isValidMessageHash
    );
    assertIsValidPrivateKey('secp256k1.sign', privateKey, isValidPrivateKey);
    const sig = ec.sign(messageHash, privateKey);
    return utils.concatBytes(
        utils.numberToBytesBE(sig.r, 32),
        utils.numberToBytesBE(sig.s, 32),
        utils.numberToVarBytesBE(sig.recovery)
    );
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
