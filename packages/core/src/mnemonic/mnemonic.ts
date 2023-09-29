import { ethers } from 'ethers';
import { randomBytes } from 'crypto';
import { HDNode } from '../hdnode/hdnode';

/**
 * generate BIP39 mnemonic words
 * @param rng the optional random number generator, which generates 16~32 (step 4) random bytes.
 * Every 4 bytes produce 3 words.
 */
function generate(rng?: () => Buffer): ethers.Mnemonic {
    rng = rng ?? (() => randomBytes(128 / 8));
    return ethers.Mnemonic.fromEntropy(rng());
}

/**
 * check if the given mnemonic words have valid checksum
 * @param words mnemonic words
 */
function validate(words: string[]): boolean {
    return ethers.Mnemonic.isValidMnemonic(words.join(' '));
}

/**
 * derive private key at index 0 from mnemonic words according to BIP32.
 * the derivation path is defined at https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 */
function derivePrivateKey(words: string[]): Buffer {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return HDNode.fromMnemonic(words).derive(0).privateKey!;
}

export const mnemonic = {
    generate,
    validate,
    derivePrivateKey
};
