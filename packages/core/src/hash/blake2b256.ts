import { Hex, Hex0x } from '../utils';
import { NFC } from '../utils/nfc/NFC';
import { assertIsValidReturnType } from '../assertions';
import { blake2b } from '@noble/hashes/blake2b';
import { buildError, DATA } from '@vechain/sdk-errors';
import { hexToBytes } from '@noble/hashes/utils';
import { type ReturnType } from './types';

/* --- Overloaded functions start --- */

/**
 * Computes the Blake2bB-256 hash of the given data.
 * If `data` is a string this is normalized using the {@link NORMALIZATION_FORM_CANONICAL_COMPOSITION} encoding.
 *
 * @param {string | Uint8Array} data - The data to compute the hash for. It can be either a string or a Uint8Array.
 *
 * @return {Uint8Array} - The computed hash as a Uint8Array.
 *
 * @throws {InvalidDataReturnTypeError} - If the specified return type is invalid.
 *
 * @remark Use {@link blake2b256OfHex} to hash a string representing an array of bytes in hexadecimal form.
 */
function blake2b256(data: string | Uint8Array): Uint8Array;

/**
 * Calculates the Blake2b-256 hash of the given data.
 * If `data` is a string this is normalized using the {@link NORMALIZATION_FORM_CANONICAL_COMPOSITION} encoding.
 *
 * @param {string | Uint8Array} data - The input data to be hashed.
 * @param {string} returnType - The return type of the hash. It can be 'buffer'.
 *
 * @return {Uint8Array} - The Blake2b-256 hash of the given data as a Uint8Array.
 *
 * @throws {InvalidDataReturnTypeError} - If the specified return type is invalid.
 *
 * @remark Use {@link blake2b256OfHex} to hash a string representing an array of bytes in hexadecimal form.
 */
function blake2b256(
    data: string | Uint8Array,
    returnType: 'buffer'
): Uint8Array;

/**
 * Computes the blake2b-256 hash of the input data.
 * If `data` is a string this is normalized using the {@link NORMALIZATION_FORM_CANONICAL_COMPOSITION} encoding.
 *
 * @param {string | Uint8Array} data - The input data to be hashed.
 * @param {string} returnType - The return type of the hash. It can be 'hex'.
 *
 * @return {Uint8Array} The blake2b-256 hash of the input data.
 *
 * @throws {InvalidDataReturnTypeError} - If the specified return type is invalid.
 *
 * @remark Use {@link blake2b256OfHex} to hash a string representing an array of bytes in hexadecimal form.
 */
function blake2b256(data: string | Uint8Array, returnType: 'hex'): string;

/* --- Overloaded functions end --- */

/**
 * Calculates the Blake2b-256 hash of the given input data.
 * If `data` is a string this is normalized using the {@link NORMALIZATION_FORM_CANONICAL_COMPOSITION} encoding.
 *
 * Secure audit function.
 * * {@link blake2b256OfArray}
 * * {@link blake2b256OfString}
 *
 * @param {string | Uint8Array} data - The input data to hash.
 *                                     It can be either a string calling {@link blake2b256OfString},
 *                                     or a Uint8Array calling {@link blake2b256OfArray}.
 * @param {string} [returnType='buffer'] - The desired return type of the hash. It can be 'buffer' or 'hex'.
 *                                         It is `buffer` by default.
 * @return {Uint8Array | string} - The hash value of the input data in the specified return type.
 *                                 If `returnType` is `hex` it returns the hexadecimal expression of the hash prefixed with `0x`.
 * @throws {InvalidDataReturnTypeError} - If the specified return type is invalid.
 *
 * @remark Use {@link blake2b256OfHex} to hash a string representing an array of bytes in hexadecimal form.
 */
function blake2b256(
    data: string | Uint8Array,
    returnType: ReturnType = 'buffer'
): Uint8Array | string {
    assertIsValidReturnType('blake2b256', returnType);
    if (data instanceof Uint8Array) {
        const hash = blake2b256OfArray(data);
        return returnType === 'hex' ? Hex0x.of(hash) : hash;
    } else {
        const hash = blake2b256OfString(data);
        return returnType === 'hex' ? Hex0x.of(hash) : hash;
    }
}

/**
 * Calculates the BLAKE2b-256 hash value of an array.
 *
 * Secure audit function.
 * * [blake2b](https://github.com/paulmillr/noble-hashes?tab=readme-ov-file#blake2b-blake2s-blake3)
 *
 * @param {Uint8Array} array - The input array to calculate the hash value for.
 * @return {Uint8Array} The BLAKE2b-256 hash value of the input array.
 */
function blake2b256OfArray(array: Uint8Array): Uint8Array {
    return blake2b.create({ dkLen: 32 }).update(array).digest();
}

/**
 *
 * Calculate the Blake2b-256 hash of a hexadecimal string.
 *
 * Secure audit function.
 * * {@link blake2b256OfArray}
 *
 * @param {string} hex - The hexadecimal string to calculate the hash for, optionally prefixed with `0x`.
 * @param {string} returnType - The type of the return value. Must be either "buffer" or "hex", it's "buffer" by default.
 * @returns {string|Uint8Array} - The hash as either a hexadecimal string or Uint8Array, depending on the returnType parameter.
 * @throws {InvalidDataTypeError} - Throws an error if the conversion fails or the returnType is invalid.
 * @throws {InvalidDataReturnTypeError} - If the specified return type is invalid.
 */
function blake2b256OfHex(
    hex: string,
    returnType: ReturnType = 'buffer'
): string | Uint8Array {
    assertIsValidReturnType('blake2b256', returnType);
    try {
        const hash = blake2b256OfArray(hexToBytes(Hex.canon(hex)));
        return returnType === 'hex' ? Hex0x.of(hash) : hash;
    } catch (e) {
        throw buildError(
            'blake2b256OfHex',
            DATA.INVALID_DATA_TYPE,
            (e as Error).message,
            { hex },
            e
        );
    }
}

/**
 * Calculates the BLAKE2b-256 hash of a given string.
 * The string is normalized using the {@link NORMALIZATION_FORM_CANONICAL_COMPOSITION} encoding.
 *
 * Secure audit function.
 * * {@link blake2b256OfArray}
 * * [utf8ToBytes](https://github.com/paulmillr/noble-hashes?tab=readme-ov-file#utils)
 *
 * @param {string} txt - The string to calculate the hash for.
 * @return {Uint8Array} - The BLAKE2b-256 hash as a Uint8Array.
 */
function blake2b256OfString(txt: string): Uint8Array {
    return blake2b256OfArray(NFC.encode(txt));
}

export { blake2b256, blake2b256OfHex };
