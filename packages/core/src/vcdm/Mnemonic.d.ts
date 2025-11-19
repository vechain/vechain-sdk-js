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
/**
 * The Mnemonic class provides functionality related to mnemonic phrases, including encoding to bytes,
 * generating, validating, and deriving keys from mnemonic words based on the BIP39 standard.
 * It implements the VeChainDataModel interface.
 *
 * @implements VeChainDataModel
 */
declare class Mnemonic implements VeChainDataModel<Mnemonic> {
    /**
     * A TextEncoder instance used for encoding text to bytes.
     *
     * @type {TextEncoder}
     */
    private static readonly ENCODER;
    /**
     * Throws an exception because the mnemonic cannot be represented as a big integer.
     * @returns {bigint} The BigInt representation of the mnemonic.
     * @throws {InvalidOperation} The mnemonic cannot be represented as a bigint.
     * @override {@link VeChainDataModel#bi}
     * @remark The conversion to BigInt is not supported for a mnemonic.
     */
    get bi(): bigint;
    /**
     * Generates a mnemonic as encoded bytes.
     *
     * @returns {Uint8Array} The bytes representation of the words with spaces.
     */
    get bytes(): Uint8Array;
    /**
     * Throws an exception because the mnemonic cannot be represented as a number.
     * @returns {bigint} The number representation of the mnemonic.
     * @throws {InvalidOperation} The mnemonic cannot be represented as a number.
     * @override {@link VeChainDataModel#n}
     * @remark The conversion to number is not supported for a mnemonic.
     */
    get n(): number;
    /**
     * There is no comparison for a mnemonic.
     *
     * @throws {InvalidOperation} The mnemonic cannot be compared.
     */
    compareTo(_that: Mnemonic): number;
    /**
     * There is no comparison for a mnemonic.
     *
     * @throws {InvalidOperation} The mnemonic cannot be compared.
     */
    isEqual(_that: Mnemonic): boolean;
    /**
     * Convert the number of words to the corresponding strength.
     *
     * @param numberOfWords - The number of words.
     *
     * @returns {number} The corresponding strength.
     *
     * @throws {InvalidDataType} If the number of words is not valid.
     */
    private static wordsNoToStrength;
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
    static toPrivateKey(words: string[], path?: string): Uint8Array;
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
    static of(wordlistSize?: WordlistSizeType, randomGenerator?: (numberOfBytes: WordListRandomGeneratorSizeInBytes) => Uint8Array): string[];
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
    static isValid(words: string | string[]): boolean;
}
export { Mnemonic };
export type { WordListRandomGeneratorSizeInBytes, WordlistSizeType };
//# sourceMappingURL=Mnemonic.d.ts.map