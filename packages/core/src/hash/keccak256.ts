import { ethers } from 'ethers';
import { type ReturnType, type HashInput } from './types';
import { isValidReturnType } from './helpers';
import { buildError, DATA } from '@vechain-sdk/errors';

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
 * Computes the keccak256 hash of the given data and returns the hash based on the returnType specified.
 * Defaults to returning a Buffer if returnType is not provided.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @param returnType - The format in which to return the hash. Either 'buffer' or 'hex'.
 *                   Defaults to 'buffer' if not provided.
 * @returns A Buffer or a string representing the 256-bit keccak256 hash of the provided data,
 *         based on the returnType specified.
 *
 * @throws Will throw an error if an invalid returnType is provided.
 */
function keccak256(
    data: HashInput,
    returnType: ReturnType = 'buffer'
): Buffer | string {
    if (!isValidReturnType(returnType)) {
        throw buildError(
            DATA.INVALID_DATA_RETURN_TYPE,
            "Invalid return type. Return type should be either 'buffer' or 'hex'"
        );
    }

    const hash = ethers.isBytesLike(data)
        ? ethers.keccak256(data)
        : ethers.keccak256(ethers.toUtf8Bytes(data));

    return returnType === 'buffer' ? Buffer.from(hash.slice(2), 'hex') : hash;
}

export { keccak256 };
