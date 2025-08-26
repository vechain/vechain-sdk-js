import * as s_bip32 from '@scure/bip32';
import * as s_bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import {
    InvalidDataType,
    InvalidHDKey,
    InvalidHDKeyMnemonic,
    InvalidOperation
} from '@vechain/sdk-errors';
import { type VeChainDataModel } from './VeChainDataModel';
import { HDKey } from '../hdkey';

/**
 * Type of the wordlist size.
 * Every 4 bytes produce 3 words.
 */
type WordlistSizeType = 12 | 15 | 18 | 21 | 24;

/**
 * Size of the mnemonic words in bytes.
 */
type WordListRandomGeneratorSizeInBytes = 16 | 20 | 24 | 28 | 32;

/**
 * The Mnemonic class provides functionality related to mnemonic phrases, including encoding to bytes,
 * generating, validating, and deriving keys from mnemonic words based on the BIP39 standard.
 * It implements the VeChainDataModel interface.
 *
 * @implements VeChainDataModel
 */
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
     * There is no comparison for a mnemonic.
     *
     * @throws {InvalidOperation} The mnemonic cannot be compared.
     */
    public compareTo(_that: Mnemonic): number {
        throw new InvalidOperation(
            'Mnemonic.compareTo',
            'There is no comparison for a mnemonic since it is not stored in memory.',
            { data: '' }
        );
    }

    /**
     * There is no comparison for a mnemonic.
     *
     * @throws {InvalidOperation} The mnemonic cannot be compared.
     */
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
     * @param numberOfWords - The number of words.
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
     * Derives a private key for the given mnemonic words and derivation path.
     *
     * @param {string[]} words - An array of mnemonic words used to generate the private key.
     * @param {string} [path=HDKey.VET_DERIVATION_PATH+'/0'] - The BIP32 derivation path to derive the private key.
     * @return {Uint8Array} The derived private key as a Uint8Array.
     * @throws {InvalidHDKey} If the provided derivation path is invalid.
     *
     * @remarks Security auditable method, depends on {@link HDKey}.
     */
    public static toPrivateKey(
        words: string[],
        path: string = HDKey.VET_DERIVATION_PATH + '/0'
    ): Uint8Array {
        const master = s_bip32.HDKey.fromMasterSeed(
            s_bip39.mnemonicToSeedSync(words.join(' ').toLowerCase())
        );
        // Any exception involving mnemonic words is thrown before this point: words are not leaked next.
        try {
            // Derived from root, a private key is always available.
            return master.derive(path).privateKey as Uint8Array;
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
     * @param {WordlistSizeType} wordlistSize - The number of words to generate the mnemonic.
     * @param {function} [randomGenerator] - The random generator function used to generate the entropy.
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
                return s_bip39
                    .entropyToMnemonic(randomGenerator(numberOfBytes), wordlist)
                    .split(' ');
            }
            return s_bip39.generateMnemonic(wordlist, strength).split(' ');
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
     * @param {string | string[]} words - The mnemonic words to check.
     *
     * @returns {boolean} true if the words are valid, false otherwise.
     *
     * @remarks Security auditable method, depends on
     * * [validateMnemonic](https://github.com/paulmillr/scure-bip39).
     */
    public static isValid(words: string | string[]): boolean {
        const wordsToValidate = Array.isArray(words) ? words.join(' ') : words;
        return s_bip39.validateMnemonic(wordsToValidate, wordlist);
    }
}

export { Mnemonic };
export type { WordListRandomGeneratorSizeInBytes, WordlistSizeType };
