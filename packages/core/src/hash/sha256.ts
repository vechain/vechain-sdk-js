import { ethers } from 'ethers';
import { type HashInput } from './types';

/**
 * Sha256 hash function implementation.
 * It uses last version of ethers.js library.
 *
 * @param data Data to hash
 * @returns Hash of data
 */
function sha256(data: HashInput): string {
    // Data is not bytes-like
    if (ethers.isBytesLike(data)) {
        return ethers.sha256(data);
    }

    // Data is string
    return ethers.sha256(ethers.toUtf8Bytes(data));
}

export { sha256 };
