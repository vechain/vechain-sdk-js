import { assertIsValidReturnType } from '../assertions';
import { keccak_256 } from '@noble/hashes/sha3';
import { type HashInput, type ReturnType } from './types';
import { Hex0x } from '../utils';

/* --- Overloaded functions start --- */

/**
 * Computes the keccak256 hash of the given data.
 * Returns the hash as a Buffer.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @returns A Buffer containing the 256-bit keccak256 hash of the provided data.
 */
function keccak256(data: HashInput): Buffer;

/**
 * Computes the keccak256 hash of the given data.
 * Returns the hash as a Buffer.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @param returnType - The format in which to return the hash. Either 'buffer' or 'hex'.
 * @returns {Buffer} A Buffer containing the 256-bit keccak256 hash of the provided data.
 */
function keccak256(data: HashInput, returnType: 'buffer'): Buffer;

/**
 * Computes the keccak256 hash of the given data.
 * Returns the hash as a hex string, prefixed with `0x`.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @param returnType - The format in which to return the hash. Either 'hex' or 'buffer'.
 * @returns {string} A string representing the hexadecimal format of the 256-bit keccak256 hash, prefixed with `0x`.
 */
function keccak256(data: HashInput, returnType: 'hex'): string;

/* --- Overloaded functions end --- */

/**
 * Calculates the keccak256 hash of the given data and returns the hash based on the returnType specified.
 * Defaults to returning a Buffer if returnType is not provided.
 *
 * Secure audit function.
 * * [keccak_256](https://github.com/paulmillr/noble-hashes?tab=readme-ov-file#sha3-fips-shake-keccak).
 *
 * @param {HashInput} data - The data to be hashed, either a Buffer or string.
 * @param {ReturnType} [returnType='buffer'] - The desired return type, either 'buffer' or 'hex'. Default is 'buffer'.
 *
 * @return {Buffer|string} The keccak256 hash of the data.
 *
 * @throws{InvalidDataReturnTypeError}
 */
function keccak256(
    data: string | Uint8Array,
    returnType: ReturnType = 'buffer'
): Buffer | string {
    // Assert that the returnType is valid
    assertIsValidReturnType('keccak256', returnType);
    const hash = keccak_256(data);
    return returnType === 'buffer' ? Buffer.from(hash) : Hex0x.of(hash);
}

export { keccak256 };
