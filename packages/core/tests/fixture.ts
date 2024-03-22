import { randomBytes } from 'crypto';
import { Hex0x } from '../src';

/**
 * Generates a random buffer of the specified length
 *
 * @param length - The length of the buffer to generate
 * @returns A random buffer of the specified length
 */
const generateRandomBytes = (length: number): Buffer => {
    return randomBytes(length);
};

/**
 * Generates a random valid address
 *
 * @returns A random valid address of 20 bytes
 */
const generateRandomValidAddress = (): string => {
    const buffer = generateRandomBytes(20);

    return Hex0x.of(buffer);
};

/**
 * Generates a random valid transaction ID
 *
 * @returns A random valid transaction ID of 32 bytes
 */
const generateRandomTransactionID = (): string => {
    const buffer = generateRandomBytes(32);

    return Hex0x.of(buffer);
};

/**
 * Generates a random valid transaction head
 *
 * @returns - A random valid transaction head of 32 bytes
 */
const generateRandomTransactionHead = (): string => {
    return generateRandomTransactionID();
};

/**
 * Generates a random private key
 * @returns A random private key of 32 bytes
 *
 * @note This is not a valid private key, but it's enough for testing purposes
 *       Do not use this private key in production or in mainnet
 */
const generateRandomPrivateKey = (): Buffer => {
    return generateRandomBytes(32);
};

export {
    generateRandomBytes,
    generateRandomValidAddress,
    generateRandomTransactionID,
    generateRandomTransactionHead,
    generateRandomPrivateKey
};
