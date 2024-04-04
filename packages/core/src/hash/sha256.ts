import { sha256 as _sha256 } from '@noble/hashes/sha256';
import { type ReturnType } from './types';
import { assertIsValidReturnType } from '../assertions';
import { Hex0x } from '../utils';

/* --- Overloaded functions start --- */

/**
 * Computes the sha256 hash of the given data.
 * Returns the hash as a Buffer.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @returns A Buffer containing the 256-bit sha256 hash of the provided data.
 */
function sha256(data: string | Uint8Array): Buffer;

/**
 * Computes the sha256 hash of the given data.
 * Returns the hash as a Buffer.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @param returnType - The format in which to return the hash. Either 'buffer' or 'hex'.
 * @returns {Buffer} A Buffer containing the 256-bit sha256 hash of the provided data.
 */
function sha256(data: string | Uint8Array, returnType: 'buffer'): Buffer;

/**
 * Computes the sha256 hash of the given data.
 * Returns the hash as a hex string, prefixed with `0x`.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @param returnType - The format in which to return the hash. Either 'hex' or 'buffer'.
 * @returns {string} A string representing the hexadecimal format of the 256-bit sha256 hash, prefixed with `0x`.
 */
function sha256(data: string | Uint8Array, returnType: 'hex'): string;

/* --- Overloaded functions end --- */

/**
 * Calculates the SHA-256 hash of the given data.
 *
 * Secure audit function.
 * * [_sha256](https://github.com/paulmillr/noble-hashes?tab=readme-ov-file#sha2-sha256-sha384-sha512-sha512_256)
 *
 * @param {string | Uint8Array} data - The data to be hashed. It can be either a string or a Uint8Array.
 * @param {ReturnType} returnType - The return type. Default is 'buffer'. Valid options are 'buffer' or 'string'.
 * @returns {Buffer | string} - The SHA-256 hash value. If the returnType is 'buffer', it returns a Buffer object. If the returnType is 'string', it returns a hexadecimal string representation
 * of the hash.
 */
function sha256(
    data: string | Uint8Array,
    returnType: ReturnType = 'buffer'
): Buffer | string {
    // Assert that the returnType is valid
    assertIsValidReturnType('sha256', returnType);
    const hash = _sha256(data);
    return returnType === 'buffer' ? Buffer.from(hash) : Hex0x.of(hash);
}

export { sha256 };
