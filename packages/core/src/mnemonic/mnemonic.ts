import { ethers } from 'ethers';
import { randomBytes } from 'crypto';
import { HDNode } from '../hdnode';
import {
    type WordListRandomGeneratorSizeInBytes,
    type WordlistSizeType
} from './types';
import { MNEMONIC_WORDLIST_ALLOWED_SIZES } from '../utils';
import { assert, HDNODE } from '@vechainfoundation/vechain-sdk-errors';

/* --- Overloaded functions start --- */

/**
 * Generate BIP39 mnemonic words
 * We can have 12, 15, 18, 21, 24 words
 *
 * @param wordlistSize - Wordlist size expected. Every 4 bytes produce 3 words.
 * @param randomGenerator - The optional random number generator to use.
 * @returns Mnemonic words
 */
function generate(
    wordlistSize?: WordlistSizeType,
    randomGenerator?: (
        numberOfBytes: WordListRandomGeneratorSizeInBytes
    ) => Buffer
): string[];

/**
 * Generate BIP39 mnemonic words
 * We can have 12, 15, 18, 21, 24 words
 *
 * @param wordlistSize - Wordlist size expected. Every 4 bytes produce 3 words.
 * @returns Mnemonic words
 */
function generate(wordlistSize?: WordlistSizeType): string[];

/* --- Overloaded functions end --- */

/**
 * Generate BIP39 mnemonic words
 * We can have 12, 15, 18, 21, 24 words
 *
 * @throws{InvalidHDNodeMnemonicsError}
 * @param wordlistSize - Wordlist size expected. Every 4 bytes produce 3 words.
 * @param randomGenerator - The optional random number generator to use.
 * @returns Mnemonic words
 */
function generate(
    wordlistSize?: WordlistSizeType,
    randomGenerator?: (
        numberOfBytes: WordListRandomGeneratorSizeInBytes
    ) => Buffer
): string[] {
    // Strange edge case in wordlist size
    assert(
        wordlistSize === undefined ||
            MNEMONIC_WORDLIST_ALLOWED_SIZES.includes(wordlistSize),
        HDNODE.INVALID_HDNODE_MNEMONICS,
        'Invalid wordlist size given as input. Allowed sizes are 12, 15, 18, 21, 24 words.',
        { wordlistSize }
    );

    // Use randomBytes as default random generator if not provided
    randomGenerator =
        randomGenerator ??
        // Default random generator
        ((numberOfBytes: number) => randomBytes(numberOfBytes));

    // Worldlist size
    const wordlistSizeToUse = wordlistSize ?? 12;

    // Generate entropy
    return ethers.Mnemonic.fromEntropy(
        randomGenerator(
            ((wordlistSizeToUse / 3) * 4) as WordListRandomGeneratorSizeInBytes
        )
    ).phrase.split(' ');
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
 * @param derivationPathFromCurrentNode Derivation path starting from the current HD node
 * @example `0` (default)
 * @example `0/2`
 * @example `0/2/4/6`
 * @returns Private key
 */
function derivePrivateKey(
    words: string[],
    derivationPathFromCurrentNode: string = '0'
): Buffer {
    return HDNode.fromMnemonic(words).derivePath(derivationPathFromCurrentNode)
        .privateKey as Buffer;
}

/**
 *
 * Derive address at a specific index from mnemonic words. The default index is 0.
 *
 * @param words Mnemonic words
 * @param derivationPathFromCurrentNode Derivation path starting from the current HD node
 * @example `0` (default)
 * @example `0/2`
 * @example `0/2/4/6`
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
