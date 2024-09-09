import * as nc_utils from '@noble/curves/abstract/utils';
import { HexUInt } from '../vcdm/HexUInt';
import { randomBytes as nh_randomBytes } from '@noble/hashes/utils';
import { secp256k1 as nc_secp256k1 } from '@noble/curves/secp256k1';
import {
    InvalidSecp256k1MessageHash,
    InvalidSecp256k1PrivateKey,
    InvalidSecp256k1Signature
} from '@vechain/sdk-errors';

/**
 * The Secp256k1 class provides cryptographic utilities for the
 * [SECP256K1](https://en.bitcoin.it/wiki/Secp256k1)
 * [elliptic curve](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm),
 * including compressing and inflating public keys,
 * generating private keys, and validating message hashes and private keys.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Secp256k1 {
    /**
     * This value is used to identify compressed public key.
     */
    private static readonly COMPRESSED_PREFIX = 2;

    /**
     * Represents the fixed length of the cryptographic signature.
     * The value is set to 65, which is the size in bytes
     * required for a 520-bit signature.
     *
     * @constant {number} SIGNATURE_LENGTH
     */
    private static readonly SIGNATURE_LENGTH = 65;

    /**
     * This value is used to identify uncompressed public key.
     */
    private static readonly UNCOMPRESS_PREFIX = 4;

    /**
     * Defines the required length for a valid hash.
     */
    private static readonly VALID_HASH_LENGTH = 32;

    /**
     * Compresses an uncompressed public key.
     *
     * @param {Uint8Array} publicKey - The uncompressed public key to be compressed.
     * @return {Uint8Array} - The compressed public key.
     *
     * @see Secp256k1.inflatePublicKey
     */
    public static compressPublicKey(publicKey: Uint8Array): Uint8Array {
        const prefix = publicKey.at(0);
        if (prefix === Secp256k1.UNCOMPRESS_PREFIX) {
            // To compress.
            const x = publicKey.slice(1, 33);
            const y = publicKey.slice(33, 65);
            const isYOdd = y[y.length - 1] & 1;
            // Prefix with 0x02 if Y coordinate is even, 0x03 if odd.
            return nc_utils.concatBytes(
                Uint8Array.of(Secp256k1.COMPRESSED_PREFIX + isYOdd),
                x
            );
        } else {
            // Compressed.
            return publicKey;
        }
    }

    /**
     * Derives the public key from a given private key.
     *
     * @param {Uint8Array} privateKey - The private key in Uint8Array format. Must be a valid 32-byte secp256k1 private key.
     * @param {boolean} [isCompressed=true] - Indicates whether the derived public key should be in compressed format.
     * @return {Uint8Array} The derived public key in Uint8Array format.
     * @throws {InvalidSecp256k1PrivateKey} Throws an error if the provided private key is not valid.
     *
     * @remarks Security auditable method, depends on
     * * [nc_secp256k1.getPublicKey](https://github.com/paulmillr/noble-secp256k1).
     */
    public static derivePublicKey(
        privateKey: Uint8Array,
        isCompressed: boolean = true
    ): Uint8Array {
        // Check if the private key is valid.
        if (Secp256k1.isValidPrivateKey(privateKey)) {
            return nc_secp256k1.getPublicKey(privateKey, isCompressed);
        }
        throw new InvalidSecp256k1PrivateKey(
            'Secp256k1.derivePublicKey',
            'Invalid private key given as input. Ensure it is a valid 32-byte secp256k1 private key.',
            undefined
        );
    }

    /**
     * Generates a new random private key.
     * If an error occurs during generation using
     * [nc_secp256k1](https://github.com/paulmillr/noble-secp256k1),
     * an AES-GCM key is generated as a fallback in runtimes not supported
     * by `nc_secp256k1`, if those support {@link {@link global.crypto}.
     *
     * @return {Promise<Uint8Array>} The generated private key as a Uint8Array.
     *
     * @remarks Security auditable method, depends on
     * * {@link global.crypto.subtle.exportKey};
     * * {@link global.crypto.subtle.generateKey};
     * * [nc_secp256k1.utils.randomPrivateKey](https://github.com/paulmillr/noble-secp256k1).
     */
    public static async generatePrivateKey(): Promise<Uint8Array> {
        try {
            return nc_secp256k1.utils.randomPrivateKey();
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
            const rawKey = await global.crypto.subtle.exportKey(
                'raw',
                cryptoKey
            );

            // Convert the ArrayBuffer to Uint8Array
            return new Uint8Array(rawKey);
        }
    }

    /**
     * Inflate a compressed public key to its uncompressed form.
     *
     * @param {Uint8Array} publicKey - The compressed public key to be inflated.
     * @return {Uint8Array} - The uncompressed public key.
     *
     * @remarks Security auditable method, depends on
     * * [nc_secp256k1.ProjectivePoint.fromAffine](https://github.com/paulmillr/noble-secp256k1);
     * * [nc_secp256k1.ProjectivePoint.fromHex](https://github.com/paulmillr/noble-secp256k1);
     * * [nc_secp256k1.ProjectivePoint.toAffine](https://github.com/paulmillr/noble-secp256k1).
     *
     * @see Secp256K1.compressPublicKey
     */
    public static inflatePublicKey(publicKey: Uint8Array): Uint8Array {
        const prefix = publicKey.at(0);
        if (prefix !== Secp256k1.UNCOMPRESS_PREFIX) {
            // To inflate.
            const x = publicKey.slice(0, 33);
            const p = nc_secp256k1.ProjectivePoint.fromAffine(
                nc_secp256k1.ProjectivePoint.fromHex(
                    HexUInt.of(x).digits
                ).toAffine()
            );
            return p.toRawBytes(false);
        } else {
            // Inflated.
            return publicKey;
        }
    }

    /**
     * Checks whether the provided hash is a valid message hash.
     *
     * @param {Uint8Array} hash - The hash to be validated.
     * @return {boolean} `true` if the hash is 32 bytes long, otherwise `false`.
     */
    public static isValidMessageHash(hash: Uint8Array): boolean {
        return hash.length === Secp256k1.VALID_HASH_LENGTH;
    }

    /**
     * Checks if the provided private key is valid.
     *
     * @param {Uint8Array} privateKey - The private key to validate.
     * @return {boolean} `true` if the private key is valid, `false` otherwise.
     *
     * @remarks Security auditable method, depends on
     * * [nc_secp256k1.utils.isValidPrivateKey](https://github.com/paulmillr/noble-secp256k1).
     */
    public static isValidPrivateKey(privateKey: Uint8Array): boolean {
        return nc_secp256k1.utils.isValidPrivateKey(privateKey);
    }

    /**
     * Generates a random sequence of bytes.
     * If an error occurs during generation using
     * [nc_secp256k1](https://github.com/paulmillr/noble-secp256k1),
     * {@link {@link global.crypto} is used as fall back togenerate
     * the random sequence.
     *
     * @param {number} [bytesLength=32] - Optional. The number of random bytes to generate.
     * @return {Uint8Array} - A Uint8Array containing the random bytes.
     *
     * @remarks Security auditable method, depends on
     *  * {@link global.crypto.getRandomValues};
     * * [nh_randomBytes](https://github.com/paulmillr/noble-hashes).
     */
    public static randomBytes(bytesLength?: number | undefined): Uint8Array {
        try {
            return nh_randomBytes(bytesLength);
        } catch (error) {
            return global.crypto.getRandomValues(
                new Uint8Array(bytesLength ?? 32)
            );
        }
    }

    /**
     * Recovers the public key associated with the message hash from the given signature.
     *
     * @param {Uint8Array} messageHash - The 32-byte message hash to be verified.
     * @param {Uint8Array} sig - The 65-byte signature used for recovery, consisting of the compact signature and recovery byte.
     * @return {Uint8Array} The recovered public key in its raw bytes form.
     * @throws {InvalidSecp256k1MessageHash} If the provided message hash is invalid.
     * @throws {InvalidSecp256k1Signature} If the provided signature is not 65 bytes or contains an invalid recovery value.
     *
     * @remarks Security auditable method, depends on
     * * [nc_secp256k1.Signature](https://github.com/paulmillr/noble-secp256k1).
     *
     * @see Secp256k1.isValidMessageHash
     */
    public static recover(
        messageHash: Uint8Array,
        sig: Uint8Array
    ): Uint8Array {
        // Check if the message hash is valid.
        if (!Secp256k1.isValidMessageHash(messageHash)) {
            throw new InvalidSecp256k1MessageHash(
                'Secp256k1.recover',
                'Invalid message hash given as input. Ensure it is a valid 32-byte message hash.',
                { messageHash }
            );
        }
        if (sig.length !== Secp256k1.SIGNATURE_LENGTH)
            throw new InvalidSecp256k1Signature(
                'Secp256k1.recover',
                'Invalid signature given as input. Length must be exactly 65 bytes.',
                { signature: sig }
            );
        const recovery = sig[64];
        if (recovery !== 0 && recovery !== 1)
            throw new InvalidSecp256k1Signature(
                'Secp256k1.recover',
                'Invalid signature recovery value. Signature bytes at position 64 must be 0 or 1.',
                { signature: sig, recovery }
            );
        return nc_secp256k1.Signature.fromCompact(sig.slice(0, 64))
            .addRecoveryBit(recovery)
            .recoverPublicKey(messageHash)
            .toRawBytes(false);
    }

    /**
     * Signs a given message hash using the provided private key.
     *
     * @param messageHash - A 32-byte message hash that needs to be signed.
     * @param privateKey - A 32-byte private key used for signing the message hash.
     * @return The signature of the message hash consisting of the r, s, and recovery values.
     * @throws InvalidSecp256k1MessageHash if the message hash is not a valid 32-byte hash.
     * @throws InvalidSecp256k1PrivateKey if the private key is not a valid 32-byte private key.
     *
     * @remarks Security auditable method, depends on
     * * [nc_secp256k1.sign](https://github.com/paulmillr/noble-secp256k1).
     *
     * @see Secp256k1.isValidMessageHash
     * @see Secp256k1.isValidPrivateKey
     */
    public static sign(
        messageHash: Uint8Array,
        privateKey: Uint8Array
    ): Uint8Array {
        // Check if the message hash is valid.
        if (!Secp256k1.isValidMessageHash(messageHash)) {
            throw new InvalidSecp256k1MessageHash(
                'Secp256k1.sign',
                'Invalid message hash given as input. Ensure it is a valid 32-byte message hash.',
                { messageHash }
            );
        }
        // Check if the private key is valid.
        if (!Secp256k1.isValidPrivateKey(privateKey)) {
            throw new InvalidSecp256k1PrivateKey(
                'Secp256k1.sign',
                'Invalid private key given as input. Ensure it is a valid 32-byte secp256k1 private key.',
                undefined
            );
        }
        const sig = nc_secp256k1.sign(messageHash, privateKey);
        return nc_utils.concatBytes(
            nc_utils.numberToBytesBE(sig.r, 32),
            nc_utils.numberToBytesBE(sig.s, 32),
            nc_utils.numberToVarBytesBE(sig.recovery)
        );
    }
}

export { Secp256k1 };
