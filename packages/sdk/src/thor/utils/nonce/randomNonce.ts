import { Hex } from '@common/vcdm';

/**
 * Generates a random nonce.
 * @returns A random nonce.
 */
function randomNonce(): bigint {
    return Hex.random(4).bi;
}

export { randomNonce };
