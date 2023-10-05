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
 * Derive private key at a specific index from mnemonic words according to BIP32. The default index is 0.
 * the derivation path is defined at https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 *
 * @param words Mnemonic words
 * @param derivationPathFromCurrentNode Derivation path starting from the current HD node (e.g. "0/2" if starting from the vechain sdk default derivation path)
 * @returns Private key
 */
function derivePrivateKey(
    words: string[],
    derivationPathFromCurrentNode: string = '0'
): Buffer {
    // NOTE: Here we use the ?? in order to avoid lint errors.
    return HDNode.fromMnemonic(words).derivePath(derivationPathFromCurrentNode)
        .privateKey as Buffer;
}

/**
 *
 * Derive address at a specific index from mnemonic words. The default index is 0.
 *
 * @param words Mnemonic words
 * @param derivationPathFromCurrentNode Derivation path starting from the current HD node (e.g. "0/2" if starting from the vechain sdk default derivation path)
 * @returns Address
 */
function deriveAddress(
    words: string[],
    derivationPathFromCurrentNode: string = '0'
): string {
    return HDNode.fromMnemonic(words).derivePath(derivationPathFromCurrentNode)
        .address;
}

export const mnemonic = {
    generate,
    validate,
    derivePrivateKey,
    deriveAddress
};
