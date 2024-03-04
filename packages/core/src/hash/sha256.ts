import { ethers } from 'ethers';
import { type HashInput, type ReturnType } from './types';
import { assertIsValidReturnType } from '../assertions';

/* --- Overloaded functions start --- */

/**
 * Computes the sha256 hash of the given data.
 * Returns the hash as a Buffer.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @returns A Buffer containing the 256-bit sha256 hash of the provided data.
 */
function sha256(data: HashInput): Buffer;

/**
 * Computes the sha256 hash of the given data.
 * Returns the hash as a Buffer.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @param returnType - The format in which to return the hash. Either 'buffer' or 'hex'.
 * @returns {Buffer} A Buffer containing the 256-bit sha256 hash of the provided data.
 */
function sha256(data: HashInput, returnType: 'buffer'): Buffer;

/**
 * Computes the sha256 hash of the given data.
 * Returns the hash as a hex string, prefixed with `0x`.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @param returnType - The format in which to return the hash. Either 'hex' or 'buffer'.
 * @returns {string} A string representing the hexadecimal format of the 256-bit sha256 hash, prefixed with `0x`.
 */
function sha256(data: HashInput, returnType: 'hex'): string;

/* --- Overloaded functions end --- */

/**
 * Computes the sha256 hash of the given data.
 * Returns the hash as a Buffer or hex string, depending on the returnType.
 * If no returnType is provided, the hash is returned as a Buffer.
 *
 * @throws{InvalidDataReturnTypeError}
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @param returnType - The type of the return value. Either 'buffer' or 'hex'. Defaults to 'buffer'.
 * @returns A Buffer or string representing the 256-bit sha256 hash.
 */
function sha256(
    data: HashInput,
    returnType: ReturnType = 'buffer'
): Buffer | string {
    // Assert that the returnType is valid
    assertIsValidReturnType('sha256', returnType);

    const hash = ethers.isBytesLike(data)
        ? ethers.sha256(data)
        : ethers.sha256(ethers.toUtf8Bytes(data));

    return returnType === 'buffer' ? Buffer.from(hash.slice(2), 'hex') : hash;
}

export { sha256 };
