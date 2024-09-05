import {
    entropyToMnemonic,
    generateMnemonic,
    validateMnemonic
} from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import {
    InvalidDataType,
    InvalidHDKey,
    InvalidHDKeyMnemonic,
    InvalidOperation
} from '@vechain/sdk-errors';
import { HDKey } from '../hdkey';
import { Address } from './Address';
import { type VeChainDataModel } from './VeChainDataModel';

/**
 * Type of the wordlist size.
 * Every 4 bytes produce 3 words.
 */
type WordlistSizeType = 12 | 15 | 18 | 21 | 24;

/**
 * Size of the mnemonic words in bytes.
 */
type WordListRandomGeneratorSizeInBytes = 16 | 20 | 24 | 28 | 32;

class Mnemonic implements VeChainDataModel<Mnemonic> {
    /**
     * A TextEncoder instance used for encoding text to bytes.
     *
     * @type {TextEncoder}
     */
    private static readonly ENCODER = new TextEncoder();

    /**
     * Throws an exception because the mnemonic cannot be represented as a big integer.
     * @returns {bigint} The BigInt representation of the mnemonic.
     * @throws {InvalidOperation} The mnemonic cannot be represented as a bigint.
     * @override {@link VeChainDataModel#bi}
     * @remark The conversion to BigInt is not supported for a mnemonic.
     */
    public get bi(): bigint {
        throw new InvalidOperation(
            'Mnemonic.bi',
            'There is no big integer representation for a mnemonic.',
            { data: '' }
        );
    }

    /**
     * Generates a mnemonic as encoded bytes.
     *
     * @returns {Uint8Array} The bytes representation of the words with spaces.
     */
    get bytes(): Uint8Array {
        return Mnemonic.ENCODER.encode(Mnemonic.of().join(' '));
    }

    /**
     * Throws an exception because the mnemonic cannot be represented as a number.
     * @returns {bigint} The number representation of the mnemonic.
     * @throws {InvalidOperation} The mnemonic cannot be represented as a number.
     * @override {@link VeChainDataModel#n}
     * @remark The conversion to number is not supported for a mnemonic.
     */
    public get n(): number {
        throw new InvalidOperation(
            'Mnemonic.n',
            'There is no number representation for a mnemonic.',
            { data: '' }
        );
    }

    /**
     *
     * @param _that The mnemonic to compare with.
     */
    public compareTo(_that: Mnemonic): number {
        throw new InvalidOperation(
            'Mnemonic.compareTo',
            'There is no comparison for a mnemonic since it is not stored in memory.',
            { data: '' }
        );
    }

    public isEqual(_that: Mnemonic): boolean {
        throw new InvalidOperation(
            'Mnemonic.isEqual',
            'There is no comparison for a mnemonic since it is not stored in memory.',
            { data: '' }
        );
    }

    /**
     * Convert the number of words to the corresponding strength.
     *
     * @param numberOfWords The number of words.
     *
     * @returns {number} The corresponding strength.
     *
     * @throws {InvalidDataType} If the number of words is not valid.
     */
    private static wordsNoToStrength(numberOfWords: number): number {
        switch (numberOfWords) {
            case 12:
                return 128;
            case 15:
                return 160;
            case 18:
                return 192;
            case 21:
                return 224;
            case 24:
                return 256;
            default:
                throw new InvalidDataType(
                    'Mnemonic.wordsNoToStrength',
                    'not a valid number of words',
                    { numberOfWords }
                );
        }
    }

    // Legacy method, probably should be part of a Private Key class (ofMnemonic) #1122
    /**
     * Derives a private key from a given list of
     * [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
     * and a derivation path as in the examples.
     *
     * @example `m/0` (default)
     * @example `m/0/2`
     * @example `m/0/2/4/6`
     *
     * @param {string[]} words - The set of words used for mnemonic generation.
     * @param {string} [path='m/0'] - The derivation path from the current node.
     *
     * @returns {Uint8Array} - The derived private key as a Uint8Array.
     *
     * @throws {InvalidHDKey}
     *
     * @remarks Security auditable method, depends on
     * * {@link HDKey}.
     */
    public static toPrivateKey(
        words: string[],
        path: string = 'm/0'
    ): Uint8Array {
        const root = HDKey.fromMnemonic(words);
        // Any exception involving mnemonic words is thrown before this point: words are not leaked next.
        try {
            // Derived from root, private key is always available.
            return root.derive(path).privateKey as Uint8Array;
        } catch (error) {
            throw new InvalidHDKey(
                'mnemonic.derivePrivateKey()',
                'Invalid derivation path given as input.',
                { derivationPath: path },
                error
            );
        }
    }

    /**
     * Generates a
     * [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
     * phrase using the specified wordlist size and random generator.
     *
     * @param {WordlistSizeType} wordlistSize The number of words to generate the mnemonic.
     * @param {function} [randomGenerator] The random generator function used to generate the entropy.
     *
     * @returns {Mnemonic} The generated mnemonic.
     *
     * @throws {InvalidDataType} If the number of words is not valid.
     *
     * @remarks Security auditable method, depends on
     * * [entropyToMnemonic](https://github.com/paulmillr/scure-bip39);
     * * [generateMnemonic](https://github.com/paulmillr/scure-bip39);
     * * `randomGenerator` - **Must provide a cryptographic secure source of entropy
     *    else any secure audit certification related with this software is invalid.**
     */
    public static of(
        wordlistSize: WordlistSizeType = 12,
        randomGenerator?: (
            numberOfBytes: WordListRandomGeneratorSizeInBytes
        ) => Uint8Array
    ): string[] {
        try {
            const strength: number = Mnemonic.wordsNoToStrength(wordlistSize);
            if (randomGenerator != null) {
                const numberOfBytes = (strength /
                    8) as WordListRandomGeneratorSizeInBytes;
                return entropyToMnemonic(
                    randomGenerator(numberOfBytes),
                    wordlist
                ).split(' ');
            }
            return generateMnemonic(wordlist, strength).split(' ');
        } catch (error) {
            throw new InvalidHDKeyMnemonic(
                'Mnemonic.of',
                'error while generating mnemonic',
                { wordlistSize },
                error
            );
        }
    }

    /**
     * Check if the given mnemonic words are valid.
     *
     * @param {string | string[]} words The mnemonic words to check.
     *
     * @returns {boolean} true if the words are valid, false otherwise.
     *
     * @remarks Security auditable method, depends on
     * * [validateMnemonic](https://github.com/paulmillr/scure-bip39).
     */
    public static isValid(words: string | string[]): boolean {
        const wordsToValidate = Array.isArray(words) ? words.join(' ') : words;
        return validateMnemonic(wordsToValidate, wordlist);
    }
}

// Backwards compatibility, remove in future versions #1184

const mnemonic = {
    deriveAddress: (words: string[], path: string = 'm/0'): string =>
        Address.ofMnemonic(words, path).toString(),
    derivePrivateKey: (words: string[], path: string = 'm/0'): Uint8Array =>
        Mnemonic.toPrivateKey(words, path),
    generate: (
        wordlistSize?: WordlistSizeType,
        randomGenerator?: (
            numberOfBytes: WordListRandomGeneratorSizeInBytes
        ) => Uint8Array
    ): string[] => Mnemonic.of(wordlistSize, randomGenerator),
    isValid: (words: string[]): boolean => Mnemonic.isValid(words)
};

export { Mnemonic, mnemonic };
export type { WordListRandomGeneratorSizeInBytes, WordlistSizeType };
