import blake from 'blakejs';
import { type HashInput } from './types';

/**
 * Internal function to compute the blake2b 256-bit hash of the given data.
 *
 * This function allows hashing multiple data items (Buffers or strings) in a single hash context,
 * aggregating the hash of all these items into a single result.
 *
 * @param ...data - One or more data items (either Buffer or string) to be hashed.
 * @returns A Buffer containing the 256-bit blake2b hash of the provided data.
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

/**
 * Computes the blake2b 256-bit hash of the given data and returns the hash as a hex string.
 *
 * This function provides a simplified and human-readable interface to obtain the blake2b hash.
 * It ensures that the resulting hash is prefixed with `0x` and is in hexadecimal format.
 *
 * @param data - The input data (either a Buffer or string) for which the hash needs to be computed.
 * @returns A string representing the hexadecimal format of the 256-bit blake2b hash, prefixed with `0x`.
 */
function blake2b256(data: HashInput): string {
    // Convert BytesLike to Buffer
    const dataBytesLike = [data] as Array<Buffer | string>;

    return `0x${_blake2b256(...dataBytesLike).toString('hex')}`;
}

export { _blake2b256, blake2b256 };
