import {
    entropyToMnemonic,
    generateMnemonic,
    validateMnemonic
} from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import {
    InvalidDataType,
    InvalidHDNode,
    InvalidHDNodeMnemonic
} from '@vechain/sdk-errors';
import { HDNode } from '../hdnode';
import { Address } from './Address';
import { Txt } from './Txt';

/**
 * Type of the wordlist size.
 * Every 4 bytes produce 3 words.
 */
type WordlistSizeType = 12 | 15 | 18 | 21 | 24;

/**
 * Size of the mnemonic words in bytes.
 */
type WordListRandomGeneratorSizeInBytes = 16 | 20 | 24 | 28 | 32;

class Mnemonic extends Txt {
    /**
     * The mnemonic words.
     * @type {string[]}
     */
    private readonly words: string[];

    /**
     * Create a new Mnemonic instance.
     *
     * @param exp The mnemonic expression to convert. It can be of type string.
     *
     * @throws {InvalidDataType} If the expression is not a valid mnemonic expression.
     */
    private constructor(exp: string) {
        super(exp);
        if (!Mnemonic.isValid(exp)) {
            throw new InvalidHDNodeMnemonic(
                'Mnemonic.constructor',
                'not a valid mnemonic string',
                { wordlistSize: -1 }
            );
        }
        this.words = exp.split(' ');
    }

    /**
     * Get the mnemonic words.
     *
     * @returns {string[]} The mnemonic words.
     */
    public getWords(): string[] {
        return [...this.words]; // Return a copy to prevent modification (should already be prevented by readonly)
    }

    /**
     * Create a Mnemonic instance from the given expression.
     *
     * @param exp The expression to convert. It can be of type string.
     *
     * @returns {Mnemonic} The converted mnemonic.
     *
     * @throws {InvalidDataType} If the expression is not a valid mnemonic expression.
     */
    public static of(exp: string): Mnemonic {
        try {
            return new Mnemonic(exp);
        } catch (error) {
            if (error instanceof InvalidHDNodeMnemonic) {
                throw error;
            }
            throw new InvalidHDNodeMnemonic(
                'Mnemonic.of',
                'not a valid mnemonic expression',
                { wordlistSize: -1 },
                error
            );
        }
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

    // TODO: Legacy method, probably should be part of a Private Key class (ofMnemonic)
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
     * @throws {InvalidHDNode}
     */
    public static toPrivateKey(
        words: string[],
        path: string = 'm/0'
    ): Uint8Array {
        const root = HDNode.fromMnemonic(words);
        // Any exception involving mnemonic words is thrown before this point: words are not leaked next.
        try {
            // Derived from root, private key is always available.
            return root.derive(path).privateKey as Uint8Array;
        } catch (error) {
            throw new InvalidHDNode(
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
     * Secure audit function.
     * - [bip39](https://github.com/paulmillr/scure-bip39)
     * - `randomGenerator` - **Must provide a cryptographic secure source of entropy
     *    else any secure audit certification related with this software is invalid.**
     *
     * @param {WordlistSizeType} wordlistSize The number of words to generate the mnemonic.
     * @param {function} [randomGenerator] The random generator function used to generate the entropy.
     *
     * @returns {Mnemonic} The generated mnemonic.
     *
     * @throws {InvalidDataType} If the number of words is not valid.
     * @remark This method is a wrapper around the `generateMnemonic` function from the `bip39` package.
     */
    public static generate(
        wordlistSize: WordlistSizeType = 12,
        randomGenerator?: (
            numberOfBytes: WordListRandomGeneratorSizeInBytes
        ) => Uint8Array
    ): Mnemonic {
        try {
            const strength: number = Mnemonic.wordsNoToStrength(wordlistSize);
            if (randomGenerator != null) {
                const numberOfBytes = (strength /
                    8) as WordListRandomGeneratorSizeInBytes;
                return Mnemonic.of(
                    entropyToMnemonic(randomGenerator(numberOfBytes), wordlist)
                );
            }
            return Mnemonic.of(generateMnemonic(wordlist, strength));
        } catch (error) {
            if (error instanceof InvalidDataType) {
                throw error;
            }
            throw new InvalidHDNodeMnemonic(
                'Mnemonic.generate',
                'error while generating mnemonic',
                { wordlistSize },
                error
            );
        }
    }

    /**
     * Check if the given mnemonic words are valid.
     * @param words The mnemonic words to check.
     * @returns {boolean} true if the words are valid, false otherwise.
     * @remark This method is a wrapper around the `validateMnemonic` function from the `bip39` package.
     */
    public static isValid(words: string): boolean {
        return validateMnemonic(words, wordlist);
    }
}

// TODO: Backwards compatibility, remove in future versions

const mnemonic = {
    deriveAddress: (words: string[], path: string = 'm/0'): string =>
        Address.ofMnemonic(Mnemonic.of(words.join(' ')), path).toString(),
    derivePrivateKey: (words: string[], path: string = 'm/0'): Uint8Array =>
        Mnemonic.toPrivateKey(words, path),
    generate: (
        wordlistSize?: WordlistSizeType,
        randomGenerator?: (
            numberOfBytes: WordListRandomGeneratorSizeInBytes
        ) => Uint8Array
    ): string[] => Mnemonic.generate(wordlistSize, randomGenerator).getWords(),
    isValid: (words: string[]): boolean => Mnemonic.isValid(words.join(' '))
};

export { Mnemonic, mnemonic };
