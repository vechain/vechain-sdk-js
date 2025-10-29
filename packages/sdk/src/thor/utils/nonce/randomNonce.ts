import { Hex } from '@common/vcdm';

/**
 * Generates a random nonce.
 * @returns A random nonce.
 */
function randomNonce(): number {
    return Number(Hex.random(4).toString());
}

export { randomNonce };
