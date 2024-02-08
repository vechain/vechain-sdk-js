import * as crypto from 'crypto';

/**
 * Generates a random hexadecimal string of a specified length.
 *
 * @param size - The length of the hexadecimal string to generate. This is twice the number of bytes that will be generated, since each byte is represented by two hexadecimal characters.
 * @returns A random hexadecimal string of the specified length.
 */
const generateRandomHex = (size: number): string => {
    // Ensure the number of bytes generated is half the size of the desired hex string length
    // since each byte will be converted to two hex characters.
    const bytes = Math.ceil(size / 2);
    return crypto.randomBytes(bytes).toString('hex').substring(0, size);
};

export const subscriptionHelper = {
    generateRandomHex
};
