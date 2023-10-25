import blake from 'blakejs';
import { type HashInput, type ReturnType } from './types';
import { isValidReturnType } from './helpers';
import { ERRORS } from '../utils';

/**
 * Internal function to compute the blake2b 256-bit hash of the given data.
 *
 * This function allows hashing multiple data items (Buffers or strings) in a single hash context,
 * aggregating the hash of all these items into a single result.
 *
 * @param data - One or more data items (either Buffer or string) to be hashed.
 * @returns {Buffer} A Buffer containing the 256-bit blake2b hash of the provided data.
 */
function _blake2b256(...data: Array<Buffer | string>): Buffer {
    const ctx = blake.blake2bInit(32);
    data.forEach((d) => {
        if (Buffer.isBuffer(d)) {
            blake.blake2bUpdate(ctx, d);
        } else {
            blake.blake2bUpdate(ctx, Buffer.from(d, 'utf8'));
        }
    });
    return Buffer.from(blake.blake2bFinal(ctx));
}

/* --- Overloaded functions start --- */

/**
 * Computes the blake2b 256-bit hash of the given data.
 * Returns the hash as a Buffer.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @returns A Buffer containing the 256-bit blake2b hash of the provided data.
 */
function blake2b256(data: HashInput): Buffer;

/**
 * Computes the blake2b 256-bit hash of the given data.
 * Returns the hash as a Buffer.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @param returnType - The format in which to return the hash. Either 'buffer' or 'hex'.
 * @returns {Buffer} A Buffer containing the 256-bit blake2b hash of the provided data.
 */
function blake2b256(data: HashInput, returnType: 'buffer'): Buffer;

/**
 * Computes the blake2b 256-bit hash of the given data.
 * Returns the hash as a hex string, prefixed with `0x`.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @param returnType - The format in which to return the hash. Either 'hex' or 'buffer'.
 * @returns {string} A string representing the hexadecimal format of the 256-bit blake2b hash, prefixed with `0x`.
 */
function blake2b256(data: HashInput, returnType: 'hex'): string;

/* --- Overloaded functions end --- */

/**
 * Computes the blake2b 256-bit hash of the given data and returns the hash based on the returnType specified.
 * Defaults to returning a Buffer if returnType is not provided.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @param returnType - The format in which to return the hash. Either 'buffer' or 'hex'.
 *                    Defaults to 'buffer' if not provided.
 * @returns A Buffer or a string representing the 256-bit blake2b hash of the provided data,
 *          based on the returnType specified.
 *
 * @throws Will throw an error if an invalid returnType is provided.
 */
function blake2b256(
    data: HashInput,
    returnType: ReturnType = 'buffer'
): Buffer | string {
    if (!isValidReturnType(returnType)) {
        throw new Error(
            ERRORS.DATA.INVALID_RETURN_TYPE("either 'buffer' or 'hex'")
        );
    }

    // Converts the data to an array of Buffer or string
    const dataBytesLike = [data] as Array<Buffer | string>;

    const hash = _blake2b256(...dataBytesLike);

    return returnType === 'buffer' ? hash : `0x${hash.toString('hex')}`;
}

export { blake2b256 };
