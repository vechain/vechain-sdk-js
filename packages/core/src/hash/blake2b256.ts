import { Hex0x } from '../utils';
import { assertIsValidReturnType } from '../assertions';
import { blake2b } from '@noble/hashes/blake2b';
import { type ReturnType } from './types';

/**
 * Internal function to calculates the BLAKE2B-256 hash of the input data.
 *
 * Secure audit function.
 * * [blake2b](https://github.com/paulmillr/noble-hashes?tab=readme-ov-file#blake2b-blake2s-blake3)
 *
 * @param {Array<Uint8Array|string>} data - The input data to be hashed.
 * It accepts multiple arguments in the form of `Uint8Array` or strings.
 *
 * @returns {Uint8Array} - The BLAKE2B-256 hash of the input data.
 */
function _blake2b256(...data: Array<Uint8Array | string>): Uint8Array {
    const ctx = blake2b.create({ dkLen: 32 });
    data.forEach((datum) => {
        ctx.update(datum);
    });
    return ctx.digest();
}

/* --- Overloaded functions start --- */

/**
 * Calculates the Blake2b-256 hash value for the given data.
 *
 * Secure audit function.
 * * {@link _blake2b256}
 *
 * @param {string | Uint8Array} data - The input data for which the hash needs to be computed.
 * @returns {Uint8Array} - The BLAKE2B-256 hash value computed for the given input data.
 */
function blake2b256(data: string | Uint8Array): Uint8Array;

/**
 * Calculates the BLAKE2b-256 hash of the given data.
 *
 * Secure audit function.
 * * {@link _blake2b256}
 *
 * @param {string | Uint8Array} data - The input data to be hashed. Can be either a string or a Uint8Array.
 * @param {'buffer'} returnType - The desired return type. Currently only supports 'buffer'.
 * @returns {Uint8Array} - The BLAKE2b-256 hash as a Uint8Array.
 */
function blake2b256(
    data: string | Uint8Array,
    returnType: 'buffer'
): Uint8Array;

/**
 * Compute the BLAKE2b-256 hash of the given data.
 *
 * Secure audit function.
 * * {@link _blake2b256}
 *
 * @param {string | Uint8Array} data - The data to hash.
 * @param {string} returnType - The desired return type of the hash. Only "hex" is supported.
 *
 * @return {string} - The BLAKE2b-256 hash of the data in the specified return type.
 */
function blake2b256(data: string | Uint8Array, returnType: 'hex'): string;

/* --- Overloaded functions end --- */

/**
 * Computes the BLAKE2b-256 hash of the given data.
 *
 * Secure audit function.
 * * {@link _blake2b256}
 * Calculates the BLAKE2b-256 hash of the provided data.
 *
 * @param {string | Uint8Array} data - The data to be hashed.
 * @param {ReturnType} [returnType='buffer'] - The type of the return value. Valid options are 'buffer' (default) and 'hex'.
 *
 * @returns {Uint8Array | string} - The computed hash value.
 * @param {string | Uint8Array} data - The data to be hashed.
 * @param {ReturnType} [returnType='buffer'] - The return type of the hash. 'buffer' returns a Buffer object, 'hex' returns a hexadecimal string.
 * @returns {Buffer | string} - The hash value calculated from the data.
 */
function blake2b256(
    data: string | Uint8Array,
    returnType: ReturnType = 'buffer'
): Uint8Array | string {
    // Assert that the returnType is valid
    assertIsValidReturnType('blake2b256', returnType);

    // Converts the data to an array of Uint8Array or string
    const dataBytesLike = [data] as Array<Uint8Array | string>;

    const hash = _blake2b256(...dataBytesLike);

    return returnType === 'buffer' ? hash : Hex0x.of(hash);
}

export { blake2b256 };
