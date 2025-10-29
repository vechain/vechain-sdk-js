import { Hex } from '@common/vcdm';

/**
 * Generates a random nonce.
 * @returns A random nonce.
 */
function randomNonce(): number {
    return parseInt(Hex.random(4).toString(), 16);
}

export { randomNonce };
