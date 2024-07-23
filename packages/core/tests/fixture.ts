import { Hex0x, secp256k1 } from '../src';

/**
 * Generates a random valid address
 *
 * @returns A random valid address of 20 bytes
 */
const generateRandomValidAddress = (): string => {
    return Hex0x.of(secp256k1.randomBytes(20));
};

export { generateRandomValidAddress };
