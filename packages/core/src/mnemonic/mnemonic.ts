import * as bip39 from '@scure/bip39';
import { HDNode } from '../hdnode';
import { MNEMONIC_WORDLIST_ALLOWED_SIZES } from '../utils';
import { addressUtils } from '../address';
import { assert, buildError, HDNODE } from '@vechain/sdk-errors';
import { secp256k1 } from '../secp256k1';
import { wordlist } from '@scure/bip39/wordlists/english';
import {
    type WordListRandomGeneratorSizeInBytes,
    type WordlistSizeType
} from './types';

/**
 * Derives the address from a given list of words of
 * [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
 * and a [BIP44 Derivation Path](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
 * as in the examples.
 *
 * Secure audit function.
 * - {@link bip32.HDKey}(https://github.com/paulmillr/scure-bip32)
 * - {@link HDNode}
 *
 * @example `m/0` (default)
 * @example `m/0/2`
 * @example `m/0/2/4/6`
 *
 * @param {string[]} words - The list of words used to generate the HD node.
 * @param {string} [path='m/0'] - The derivation path from the current node.
 *
 * @return {string} - The derived address, prefixed with `0x` according the
 * [ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).
 *
 * @throws {InvalidHDNodeMnemonicsError} If an error occurs generating the master `bip32.HDKey` from `words`.
 * @throws {InvalidHDNodeDerivationPathError} If an error occurs deriving the `bip32.HDKey` at `path` from the master HDKey
 *
 */
function deriveAddress(words: string[], path: string = 'm/0'): string {
    const root = HDNode.fromMnemonic(words);
    try {
        // Public key is always available.
        return addressUtils.fromPublicKey(
            root.derive(path).publicKey as Uint8Array
        );
    } catch (error) {
        throw buildError(
            'HDNode.fromMnemonic',
            HDNODE.INVALID_HDNODE_DERIVATION_PATH,
            'Invalid derivation path.',
            { path },
            error
        );
    }
}

/**
 * Derives a private key from a given list of
 * [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
 * and a derivation path as in the examples.
 *
 * Secure audit function.
 * - {@link bip32.HDKey}(https://github.com/paulmillr/scure-bip32)
 * - {@link HDNode}
 *
 * @example `m/0` (default)
 * @example `m/0/2`
 * @example `m/0/2/4/6`
 *
 *
 * @param {string[]} words - The set of words used for mnemonic generation.
 * @param {string} [path='m/0'] - The derivation path from the current node.
 * @returns {Uint8Array} - The derived private key as a Uint8Array.
 *
 * @throws {InvalidHDNodeMnemonicsError} If an error occurs generating the master `bip32.HDKey` from `words`.
 * @throws {InvalidHDNodeDerivationPathError} If an error occurs deriving the `bip32.HDKey` at `path` from the master HDKey
 */
function derivePrivateKey(words: string[], path: string = 'm/0'): Uint8Array {
    const root = HDNode.fromMnemonic(words);
    // Any exception involving mnemonic words is thrown before this point: words are not leaked next.
    try {
        // Derived from root, private key is always available.
        return root.derive(path).privateKey as Uint8Array;
    } catch (error) {
        throw buildError(
            'HDNode.fromMnemonic',
            HDNODE.INVALID_HDNODE_DERIVATION_PATH,
            'Invalid derivation path.',
            { path },
            error
        );
    }
}

/* --- Overloaded functions start --- */

/**
 * Generates a
 * [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
 * phrase using the specified wordlist size.
 *
 * Secure audit function.
 * - {@link generate}
 *
 * @param {WordlistSizeType} [wordlistSize] - The size of the wordlist used to generate the mnemonic phrase.
 * Valid sizes are 12, 15, 18, 21, 24.
 * @param {function} [randomGenerator] - The random generator function used to generate the entropy.
 * @returns {string[]} - An array of words representing the generated mnemonic phrase.
 * Words are chosen among the [valid English word list](https://github.com/paulmillr/scure-bip39/blob/main/src/wordlists/english.ts).
 */
function generate(
    wordlistSize?: WordlistSizeType,
    randomGenerator?: (
        numberOfBytes: WordListRandomGeneratorSizeInBytes
    ) => Uint8Array
): string[];

/**
 * Generates a
 * [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
 * phrase using the specified wordlist size.
 *
 * Secure audit function.
 * - {@link generate}
 * - `randomGenerator` - **Must provide a cryptographic secure source of entropy
 *    else any secure audit certification related with this software is invalid.**
 *    By default `randomGenerator` is based on secure {@link secp256k1.randomBytes}.
 *
 * @param {WordlistSizeType} [wordlistSize] - The size of the wordlist used to generate the mnemonic phrase.
 * Valid sizes are 12, 15, 18, 21, 24.
 * @returns {string[]} - An array of words representing the generated mnemonic phrase.
 * Words are chosen among the [valid English word list](https://github.com/paulmillr/scure-bip39/blob/main/src/wordlists/english.ts).
 */
function generate(wordlistSize?: WordlistSizeType): string[];

/* --- Overloaded functions end --- */

/**
 * Generates a
 * [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
 * phrase using the specified wordlist size and random generator.
 *
 * Secure audit function.
 * - [bip39](https://github.com/paulmillr/scure-bip39)
 * - `randomGenerator` - **Must provide a cryptographic secure source of entropy
 *    else any secure audit certification related with this software is invalid.**
 *    By default `randomGenerator` is based on secure {@link secp256k1.randomBytes}.
 *
 * @param {WordlistSizeType} [wordlistSize] - The size of the wordlist used to generate the mnemonic phrase.
 * Valid sizes are 12, 15, 18, 21, 24.
 * @param {function} [randomGenerator] - The random generator function used to generate the entropy.
 * @returns {string[]} - An array of words representing the generated mnemonic phrase.
 * Words are chosen among the [valid English word list](https://github.com/paulmillr/scure-bip39/blob/main/src/wordlists/english.ts).
 */
function generate(
    wordlistSize?: WordlistSizeType,
    randomGenerator?: (
        numberOfBytes: WordListRandomGeneratorSizeInBytes
    ) => Uint8Array
): string[] {
    // Strange edge case in wordlist size
    assert(
        'mnemonic.generate',
        wordlistSize === undefined ||
            MNEMONIC_WORDLIST_ALLOWED_SIZES.includes(wordlistSize),
        HDNODE.INVALID_HDNODE_MNEMONICS,
        'Invalid `wordlistSize` given as input. Allowed sizes are 12, 15, 18, 21, 24 words.',
        { wordlistSize }
    );

    // Use randomBytes as default random generator if not provided.
    randomGenerator =
        // Set random generator.
        randomGenerator ??
        // Default random generator.
        ((numberOfBytes: number) => secp256k1.randomBytes(numberOfBytes));

    // Wordlist size must be at least 12 elements long.
    const wordlistSizeToUse = wordlistSize ?? 12;

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
 * Check if the given mnemonic words have valid checksum
 *
 * Secure audit function.
 * - [bip39](https://github.com/paulmillr/scure-bip39)
 * - [wordlist](https://github.com/paulmillr/scure-bip39?tab=readme-ov-file#usage) is part of `bip39`.
 *
 * @param words Mnemonic words among [valid English word list](https://github.com/paulmillr/scure-bip39/blob/main/src/wordlists/english.ts)
 * @returns If mnemonic words are valid or not.
 */
function isValid(words: string[]): boolean {
    return bip39.validateMnemonic(words.join(' '), wordlist);
}

export const mnemonic = {
    deriveAddress,
    derivePrivateKey,
    generate,
    isValid
};
