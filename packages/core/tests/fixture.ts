import { Hex } from '@vcdm';
import { Secp256k1 } from '@secp256k1';

/**
 * Generates a random valid address
 *
 * @returns A random valid address of 20 bytes
 */
const generateRandomValidAddress = (): string => {
    return Hex.of(Secp256k1.randomBytes(20)).toString();
};

export { generateRandomValidAddress };
