import { Hex0x } from '../utils';
import { sha256 as _sha256 } from '@noble/hashes/sha256';
import { type ReturnType } from './types';
import { InvalidDataType } from '@vechain/sdk-errors';

/* --- Overloaded functions start --- */

/**
 * Calculates the SHA-256 hash of the given data.
 *
 * Secure audit function.
 * * {@link sha256}
 *
 * @param {string | Uint8Array} data - The data to calculate the hash for.
 * @return {Uint8Array} - The SHA-256 hash of the given data.
 */
function sha256(data: string | Uint8Array): Uint8Array;

/**
 * Calculates the SHA-256 hash of the given data.
 *
 * @param {string | Uint8Array} data - The data to calculate the SHA-256 hash for.
 * @param {'buffer'} returnType - The return type for the hash. Currently only supports 'buffer'.
 *
 * @return {Uint8Array} - The SHA-256 hash as a Uint8Array.
 */
function sha256(data: string | Uint8Array, returnType: 'buffer'): Uint8Array;

/**
 * Calculates the SHA-256 hash of the given data.
 *
 * Secure audit function.
 * * {@link sha256}
 *
 * @param {string | Uint8Array} data - The input data to be hashed.
 * @param {'hex'} returnType - The desired return type of the hash.
 * @return {string} The SHA-256 hash of the data in the specified return type.
 */
function sha256(data: string | Uint8Array, returnType: 'hex'): string;

/* --- Overloaded functions end --- */

/**
 * Computes the SHA-256 hash of the given data.
 *
 * Secure audit function.
 * * [_sha256](https://github.com/paulmillr/noble-hashes?tab=readme-ov-file#sha2-sha256-sha384-sha512-sha512_256)
 *
 * @param {string | Uint8Array} data - The data to compute the hash for.
 * @param {ReturnType} [returnType='buffer'] - The desired return type for the hash. Defaults to 'buffer'.
 * @return {Uint8Array | string} - The computed SHA-256 hash.
 * @throws {InvalidDataType}
 */
function sha256(
    data: string | Uint8Array,
    returnType: ReturnType = 'buffer'
): Uint8Array | string {
    // Assert that the returnType is valid
    if (!['hex', 'buffer'].includes(returnType)) {
        throw new InvalidDataType(
            'sha256()',
            "Validation error: Invalid return type. Return type in hash function must be 'buffer' or 'hex'.",
            { returnType }
        );
    }

    const hash = _sha256(data);
    return returnType === 'buffer' ? hash : Hex0x.of(hash);
}

export { sha256 };
