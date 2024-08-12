import * as n_utils from '@noble/curves/abstract/utils';
import { Hex } from '../vcdm/Hex';
import { SIGNATURE_LENGTH } from '../utils';
import { randomBytes as _randomBytes } from '@noble/hashes/utils';
import { secp256k1 as n_secp256k1 } from '@noble/curves/secp256k1';
import {
    InvalidSecp256k1MessageHash,
    InvalidSecp256k1PrivateKey,
    InvalidSecp256k1Signature
} from '@vechain/sdk-errors';

/**
 * Compresses a public key.
 *
 * Security audit function.
 * * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 * * [n_utils](https://github.com/paulmillr/noble-curves?tab=readme-ov-file#utils-useful-utilities)
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
        return n_utils.concatBytes(Uint8Array.of(2 + isYOdd), x);
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
 * @throws {InvalidSecp256k1PrivateKey}
 *
 * @see assertIsValidPrivateKey
 */
function derivePublicKey(
    privateKey: Uint8Array,
    isCompressed: boolean = true
): Uint8Array {
    // Check if the private key is valid.
    if (!isValidPrivateKey(privateKey)) {
        throw new InvalidSecp256k1PrivateKey(
            'secp256k1.derivePublicKey()',
            'Invalid private key given as input. Ensure it is a valid 32-byte secp256k1 private key.',
            undefined
        );
    }
    return n_secp256k1.getPublicKey(privateKey, isCompressed);
}

/**
 * Generates a new private key.
 *
 * Security audit function.
 * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 *
 * @returns {Uint8Array} The newly generated private key as a buffer.
 */
async function generatePrivateKey(): Promise<Uint8Array> {
    try {
        return n_secp256k1.utils.randomPrivateKey();
    } catch (error) {
        // Generate an ECDSA key pair
        const cryptoKey = await global.crypto.subtle.generateKey(
            {
                name: 'AES-GCM',
                length: 256
            },
            true,
            ['encrypt', 'decrypt']
        );

        // Export the private key to raw format
        const rawKey = await global.crypto.subtle.exportKey('raw', cryptoKey);

        // Convert the ArrayBuffer to Uint8Array
        return new Uint8Array(rawKey);
    }
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
        const p = n_secp256k1.ProjectivePoint.fromAffine(
            n_secp256k1.ProjectivePoint.fromHex(Hex.of(x).digits).toAffine()
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
 * * [n_utils](https://github.com/paulmillr/noble-curves?tab=readme-ov-file#utils-useful-utilities)
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
    return n_secp256k1.utils.isValidPrivateKey(privateKey);
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
    try {
        return _randomBytes(bytesLength);
    } catch (error) {
        return global.crypto.getRandomValues(new Uint8Array(bytesLength ?? 32));
    }
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
 * @throws {InvalidSecp256k1MessageHash, InvalidSecp256k1Signature}
 *
 * @see assertIsValidSecp256k1MessageHash
 */
function recover(messageHash: Uint8Array, sig: Uint8Array): Uint8Array {
    // Check if the message hash is valid.
    if (!isValidMessageHash(messageHash)) {
        throw new InvalidSecp256k1MessageHash(
            'secp256k1.sign()',
            'Invalid message hash given as input. Ensure it is a valid 32-byte message hash.',
            { messageHash }
        );
    }

    if (sig.length !== SIGNATURE_LENGTH)
        throw new InvalidSecp256k1Signature(
            'secp256k1.recover()',
            'Invalid signature given as input. Length must be exactly 65 bytes.',
            { signature: sig }
        );

    const recovery = sig[64];
    if (recovery !== 0 && recovery !== 1)
        throw new InvalidSecp256k1Signature(
            'secp256k1.recover()',
            'Invalid signature recovery value. Signature bytes at position 64 must be 0 or 1.',
            { signature: sig, recovery }
        );

    return n_secp256k1.Signature.fromCompact(sig.slice(0, 64))
        .addRecoveryBit(recovery)
        .recoverPublicKey(messageHash)
        .toRawBytes(false);
}

/**
 * Signs a message hash using a private key.
 *
 * Security audit function.
 * * [`ec` for elliptic curve](https://github.com/paulmillr/noble-curves)
 * * [n_utils](https://github.com/paulmillr/noble-curves?tab=readme-ov-file#utils-useful-utilities)
 *
 * @param {Uint8Array} messageHash - The message hash to be signed.
 * @param {Uint8Array} privateKey - The private key to use for signing.
 * @returns {Uint8Array} - The signature of the message hash.
 * @throws {InvalidSecp256k1MessageHash, InvalidSecp256k1PrivateKey}
 *
 * @see assertIsValidSecp256k1MessageHash
 * @see assertIsValidPrivateKey
 */
function sign(messageHash: Uint8Array, privateKey: Uint8Array): Uint8Array {
    // Check if the message hash is valid.
    if (!isValidMessageHash(messageHash)) {
        throw new InvalidSecp256k1MessageHash(
            'secp256k1.sign()',
            'Invalid message hash given as input. Ensure it is a valid 32-byte message hash.',
            { messageHash }
        );
    }

    // Check if the private key is valid.
    if (!isValidPrivateKey(privateKey)) {
        throw new InvalidSecp256k1PrivateKey(
            'secp256k1.sign()',
            'Invalid private key given as input. Ensure it is a valid 32-byte secp256k1 private key.',
            undefined
        );
    }

    const sig = n_secp256k1.sign(messageHash, privateKey);
    return n_utils.concatBytes(
        n_utils.numberToBytesBE(sig.r, 32),
        n_utils.numberToBytesBE(sig.s, 32),
        n_utils.numberToVarBytesBE(sig.recovery)
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
