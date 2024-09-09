import { Hex, Secp256k1 } from '../src';

/**
 * Generates a random valid address
 *
 * @returns A random valid address of 20 bytes
 */
const generateRandomValidAddress = (): string => {
    return Hex.of(Secp256k1.randomBytes(20)).toString();
};

export { generateRandomValidAddress };
