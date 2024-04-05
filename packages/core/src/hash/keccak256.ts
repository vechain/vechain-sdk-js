import { assertIsValidReturnType } from '../assertions';
import { Hex0x } from '../utils';
import { keccak_256 } from '@noble/hashes/sha3';
import { type ReturnType } from './types';

/* --- Overloaded functions start --- */

/**
 * Calculates the Keccak-256 hash of the given data.
 *
 * Secure audit function
 * * {@link keccak256}
 *
 * @param {string | Uint8Array} data - The data to hash. It can be either a string or a Uint8Array.
 *
 * @return {Uint8Array} - The Keccak-256 hash of the data.
 */
function keccak256(data: string | Uint8Array): Uint8Array;

/**
 * Calculates the Keccak-256 hash of the provided data.
 *
 * Secure audit function.
 * * {@link keccak256}
 *
 * @param {string | Uint8Array} data - The data to hash.
 * @param {'buffer'} returnType - The type of return value. Only 'buffer' is currently supported.
 *
 * @returns {Uint8Array} - The calculated Keccak-256 hash as a Uint8Array.
 */
function keccak256(data: string | Uint8Array, returnType: 'buffer'): Uint8Array;

/**
 * Returns the Keccak-256 hash of the given data.
 *
 * Secure audit function.
 * * {@link keccak256}
 *
 * @param {string | Uint8Array} data - The data to hash.
 * @param {'hex'} returnType - The type of the return value. Only 'hex' is supported.
 * @return {string} The hash value in hexadecimal format.
 */
function keccak256(data: string | Uint8Array, returnType: 'hex'): string;

/* --- Overloaded functions end --- */

/**
 * Calculates the Keccak-256 hash of the given data.
 *
 * Secure audit function.
 * * [keccak_256](https://github.com/paulmillr/noble-hashes?tab=readme-ov-file#sha3-fips-shake-keccak)
 *
 * @param {string | Uint8Array} data - The data to be hashed.
 * @param {ReturnType} [returnType='buffer'] - The return type of the hash. Defaults to 'buffer'.
 *
 * @return {Uint8Array | string} - The Keccak-256 hash data in the specified return type.
 *
 * @throws{InvalidDataReturnTypeError}
 */
function keccak256(
    data: string | Uint8Array,
    returnType: ReturnType = 'buffer'
): Uint8Array | string {
    // Assert that the returnType is valid
    assertIsValidReturnType('keccak256', returnType);
    const hash = keccak_256(data);
    return returnType === 'buffer' ? hash : Hex0x.of(hash);
}

export { keccak256 };
