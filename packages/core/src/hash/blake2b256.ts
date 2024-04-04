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
 * @param {Array<Buffer|string>} data - The input data to be hashed. It accepts multiple arguments in the form of Buffers or strings.
 *
 * @returns {Buffer} - The BLAKE2B-256 hash of the input data.
 */
function _blake2b256(...data: Array<Buffer | string>): Buffer {
    const ctx = blake2b.create({ dkLen: 32 });
    data.forEach((datum) => {
        ctx.update(datum);
    });
    return Buffer.from(ctx.digest());
}

/* --- Overloaded functions start --- */

/**
 * Calculates the Blake2b-256 hash of the given data.
 *
 * @param {string | Uint8Array} data - The data to hash. It can be either a string or a Uint8Array.
 * @returns {Buffer} - The resulting hash as a Buffer object.
 */
function blake2b256(data: string | Uint8Array): Buffer;

/**
 * Calculates the Blake2b256 hash of the given data.
 *
 * @param {string | Uint8Array} data - The data to hash. It can be either a string or a Uint8Array.
 * @param {string} returnType - The return type of the hash. Only 'buffer' is supported currently.
 * @return {Buffer} - The Blake2b256 hash of the data as a Buffer object.
 */
function blake2b256(data: string | Uint8Array, returnType: 'buffer'): Buffer;

/**
 * Calculates the Blake2b-256 hash of the provided data.
 *
 * @param {string | Uint8Array} data - The data to calculate the hash from. Can be a string or a Uint8Array.
 * @param {'hex'} returnType - The return type of the hash. Currently, only supports returning the hash as a hex string.
 * @return {string} - The calculated hash as a hex string.
 */
function blake2b256(data: string | Uint8Array, returnType: 'hex'): string;

/* --- Overloaded functions end --- */

/**
 * Calculates the BLAKE2b-256 hash of the provided data.
 *
 * @param {string | Uint8Array} data - The data to be hashed.
 * @param {ReturnType} [returnType='buffer'] - The return type of the hash. 'buffer' returns a Buffer object, 'hex' returns a hexadecimal string.
 * @returns {Buffer | string} - The hash value calculated from the data.
 */
function blake2b256(
    data: string | Uint8Array,
    returnType: ReturnType = 'buffer'
): Buffer | string {
    // Assert that the returnType is valid
    assertIsValidReturnType('blake2b256', returnType);

    // Converts the data to an array of Buffer or string
    const dataBytesLike = [data] as Array<Buffer | string>;

    const hash = _blake2b256(...dataBytesLike);

    return returnType === 'buffer' ? hash : Hex0x.of(hash);
}

export { blake2b256 };
