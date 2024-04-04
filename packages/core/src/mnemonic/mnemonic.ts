import * as bip39 from '@scure/bip39';
import { HDNode } from '../hdnode';
import { MNEMONIC_WORDLIST_ALLOWED_SIZES } from '../utils';
import { assert, HDNODE } from '@vechain/sdk-errors';
import { secp256k1 } from '../secp256k1';
import { wordlist } from '@scure/bip39/wordlists/english';
import {
    type WordListRandomGeneratorSizeInBytes,
    type WordlistSizeType
} from './types';

/**
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
 * Generates a mnemonic phrase (BIP-39 compliant) of the specified wordlist size.
 * If no wordlist size is provided, the default size of 12 words will be used.
 * If no random generator function is provided, the default randomBytes generator from the secp256k1 module will be used.
 *
 * Secure audit function.
 * * [bip39](https://github.com/paulmillr/scure-bip39)
 *
 * @param {number} [wordlistSize] - The size of the wordlist to use (12, 15, 18, 21, or 24). Default is 12.
 * @param {Function} [randomGenerator] - (Optional) The custom random generator function to use. If not provided, the default randomBytes generator will be used.
 * @returns {string[]} - An array of words representing the generated mnemonic phrase.
 */
function generate(
    wordlistSize?: WordlistSizeType,
    randomGenerator?: (
        numberOfBytes: WordListRandomGeneratorSizeInBytes
    ) => Buffer
): string[] {
    // Strange edge case in wordlist size
    assert(
        'generate',
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
        ((numberOfBytes: number) => secp256k1.randomBytes(numberOfBytes));

    // Worldlist size
    const wordlistSizeToUse = wordlistSize ?? 12;

    // Generate entropy
    return bip39
        .entropyToMnemonic(
            randomGenerator(
                ((wordlistSizeToUse / 3) *
                    4) as WordListRandomGeneratorSizeInBytes
            ),
            wordlist
        )
        .split(' ');
}

/**
 * Validates a mnemonic phrase.
 *
 * Secure audit function.
 * * [bip39](https://github.com/paulmillr/scure-bip39)
 *
 * @param {string[]} words - An array of words representing the mnemonic phrase.
 * @return {boolean} - True if the mnemonic phrase is valid, false otherwise.
 */
function validate(words: string[]): boolean {
    return bip39.validateMnemonic(words.join(' '), wordlist);
}

export const mnemonic = {
    deriveAddress,
    derivePrivateKey,
    generate,
    validate
};
