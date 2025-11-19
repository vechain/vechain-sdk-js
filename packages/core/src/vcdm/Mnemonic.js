"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mnemonic = void 0;
const s_bip32 = __importStar(require("@scure/bip32"));
const s_bip39 = __importStar(require("@scure/bip39"));
const english_1 = require("@scure/bip39/wordlists/english");
const sdk_errors_1 = require("@vechain/sdk-errors");
const hdkey_1 = require("../hdkey");
/**
 * The Mnemonic class provides functionality related to mnemonic phrases, including encoding to bytes,
 * generating, validating, and deriving keys from mnemonic words based on the BIP39 standard.
 * It implements the VeChainDataModel interface.
 *
 * @implements VeChainDataModel
 */
class Mnemonic {
    /**
     * A TextEncoder instance used for encoding text to bytes.
     *
     * @type {TextEncoder}
     */
    static ENCODER = new TextEncoder();
    /**
     * Throws an exception because the mnemonic cannot be represented as a big integer.
     * @returns {bigint} The BigInt representation of the mnemonic.
     * @throws {InvalidOperation} The mnemonic cannot be represented as a bigint.
     * @override {@link VeChainDataModel#bi}
     * @remark The conversion to BigInt is not supported for a mnemonic.
     */
    get bi() {
        throw new sdk_errors_1.InvalidOperation('Mnemonic.bi', 'There is no big integer representation for a mnemonic.', { data: '' });
    }
    /**
     * Generates a mnemonic as encoded bytes.
     *
     * @returns {Uint8Array} The bytes representation of the words with spaces.
     */
    get bytes() {
        return Mnemonic.ENCODER.encode(Mnemonic.of().join(' '));
    }
    /**
     * Throws an exception because the mnemonic cannot be represented as a number.
     * @returns {bigint} The number representation of the mnemonic.
     * @throws {InvalidOperation} The mnemonic cannot be represented as a number.
     * @override {@link VeChainDataModel#n}
     * @remark The conversion to number is not supported for a mnemonic.
     */
    get n() {
        throw new sdk_errors_1.InvalidOperation('Mnemonic.n', 'There is no number representation for a mnemonic.', { data: '' });
    }
    /**
     * There is no comparison for a mnemonic.
     *
     * @throws {InvalidOperation} The mnemonic cannot be compared.
     */
    compareTo(_that) {
        throw new sdk_errors_1.InvalidOperation('Mnemonic.compareTo', 'There is no comparison for a mnemonic since it is not stored in memory.', { data: '' });
    }
    /**
     * There is no comparison for a mnemonic.
     *
     * @throws {InvalidOperation} The mnemonic cannot be compared.
     */
    isEqual(_that) {
        throw new sdk_errors_1.InvalidOperation('Mnemonic.isEqual', 'There is no comparison for a mnemonic since it is not stored in memory.', { data: '' });
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
    static wordsNoToStrength(numberOfWords) {
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
                throw new sdk_errors_1.InvalidDataType('Mnemonic.wordsNoToStrength', 'not a valid number of words', { numberOfWords });
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
    static toPrivateKey(words, path = hdkey_1.HDKey.VET_DERIVATION_PATH + '/0') {
        const master = s_bip32.HDKey.fromMasterSeed(s_bip39.mnemonicToSeedSync(words.join(' ').toLowerCase()));
        // Any exception involving mnemonic words is thrown before this point: words are not leaked next.
        try {
            // Derived from root, a private key is always available.
            return master.derive(path).privateKey;
        }
        catch (error) {
            throw new sdk_errors_1.InvalidHDKey('mnemonic.derivePrivateKey()', 'Invalid derivation path given as input.', { derivationPath: path }, error);
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
    static of(wordlistSize = 12, randomGenerator) {
        try {
            const strength = Mnemonic.wordsNoToStrength(wordlistSize);
            if (randomGenerator != null) {
                const numberOfBytes = (strength /
                    8);
                return s_bip39
                    .entropyToMnemonic(randomGenerator(numberOfBytes), english_1.wordlist)
                    .split(' ');
            }
            return s_bip39.generateMnemonic(english_1.wordlist, strength).split(' ');
        }
        catch (error) {
            throw new sdk_errors_1.InvalidHDKeyMnemonic('Mnemonic.of', 'error while generating mnemonic', { wordlistSize }, error);
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
    static isValid(words) {
        const wordsToValidate = Array.isArray(words) ? words.join(' ') : words;
        return s_bip39.validateMnemonic(wordsToValidate, english_1.wordlist);
    }
}
exports.Mnemonic = Mnemonic;
