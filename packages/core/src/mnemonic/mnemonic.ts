import { ethers } from 'ethers';
import { randomBytes } from 'crypto';
import { HDNode } from '../hdnode/hdnode';

/**
 * Generate BIP39 mnemonic words
 *
 * @param rng the optional random number generator, which generates 16~32 (step 4) random bytes.
 * Every 4 bytes produce 3 words.
 * @returns Mnemonic words
 */
function generate(rng?: () => Buffer): ethers.Mnemonic {
    rng = rng ?? (() => randomBytes(128 / 8));
    return ethers.Mnemonic.fromEntropy(rng());
}

/**
 * Check if the given mnemonic words have valid checksum
 *
 * @param words Mnemonic words
 * @returns If mnemonic words are valid or not
 */
function validate(words: string[]): boolean {
    return ethers.Mnemonic.isValidMnemonic(words.join(' '));
}

/**
 * Derive private key at index 0 from mnemonic words according to BIP32.
 * the derivation path is defined at https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 *
 * @param words Mnemonic words
 * @returns Private key
 */
function derivePrivateKey(words: string[]): Buffer {
    // NOTE: Here we use the ?? in order to avoid lint errors.
    return HDNode.fromMnemonic(words).derive(0).privateKey as Buffer;
}

export const mnemonic = {
    generate,
    validate,
    derivePrivateKey
};
