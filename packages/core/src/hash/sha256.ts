import { Hex0x } from '../utils';
import { assertIsValidReturnType } from '../assertions';
import { sha256 as _sha256 } from '@noble/hashes/sha256';
import { type ReturnType } from './types';

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
 * Computes the sha256 hash of the given data.
 * Returns the hash as a Uint8Array.
 *
 * Secure audit function.
 * * {@link sha256}
 *
 * @param data - The input data (either a Uint8Array or string) for which the hash needs to be computed.
 * @param returnType - The format in which to return the hash. Either 'buffer' or 'hex'.
 * @returns {Uint8Array} A Uint8Array containing the 256-bit sha256 hash of the provided data.
 */
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
 *
 * @return {Uint8Array | string} - The computed SHA-256 hash.
 */
function sha256(
    data: string | Uint8Array,
    returnType: ReturnType = 'buffer'
): Uint8Array | string {
    // Assert that the returnType is valid
    assertIsValidReturnType('sha256', returnType);
    const hash = _sha256(data);
    return returnType === 'buffer' ? hash : Hex0x.of(hash);
}

export { sha256 };
