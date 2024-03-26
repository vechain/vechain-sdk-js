import { Hex0x, secp256k1 } from '../src';

/**
 * Generates a random valid address
 *
 * @returns A random valid address of 20 bytes
 */
const generateRandomValidAddress = (): string => {
    return Hex0x.of(secp256k1.randomBytes(20));
};

/**
 * Generates a random valid transaction ID
 *
 * @returns A random valid transaction ID of 32 bytes
 */
const generateRandomTransactionID = (): string => {
    return Hex0x.of(secp256k1.randomBytes(32));
};

/**
 * Generates a random valid transaction head
 *
 * @returns - A random valid transaction head of 32 bytes
 */
const generateRandomTransactionHead = (): string => {
    return generateRandomTransactionID();
};

export {
    generateRandomValidAddress,
    generateRandomTransactionID,
    generateRandomTransactionHead
};
