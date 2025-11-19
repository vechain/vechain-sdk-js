"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const HDKey_1 = require("../hdkey/HDKey");
const Hex_1 = require("./Hex");
const HexUInt_1 = require("./HexUInt");
const sdk_errors_1 = require("@vechain/sdk-errors");
const Keccak256_1 = require("./hash/Keccak256");
const Secp256k1_1 = require("../secp256k1/Secp256k1");
const Txt_1 = require("./Txt");
/**
 * Represents a VeChain Address as unsigned integer.
 *
 * @extends {HexUInt}
 */
class Address extends HexUInt_1.HexUInt {
    /**
     * The address is 20 bytes hence 40 digits long.
     */
    static DIGITS = 40;
    /**
     * It checksums a given hexadecimal address.
     *
     * @param {HexUInt} huint - The HexUInt object representing the hexadecimal value.
     *
     * @returns {string} The checksummed address.
     */
    static checksum(huint) {
        const stringAddress = huint.digits;
        const hash = Keccak256_1.Keccak256.of(Txt_1.Txt.of(stringAddress).bytes).digits;
        let checksum = '';
        for (let i = 0; i < stringAddress.length; i++) {
            checksum +=
                parseInt(hash[i], 16) > 7
                    ? stringAddress[i].toUpperCase()
                    : stringAddress[i];
        }
        return '0x' + checksum;
    }
    /**
     * Validate the given expression to be a valid address.
     *
     *  @param {string} exp - Expression to validate
     *
     * @returns {boolean} true if the expression is a valid address, false otherwise
     */
    static isValid(exp) {
        return Hex_1.Hex.isValid0x(exp) && exp.length === Address.DIGITS + 2;
    }
    /**
     * Create an Address instance from the given expression interpreted as an unsigned integer.
     *
     * @param exp - The expression to convert.
     * It can be of type bigint, number, string, Uint8Array, or HexUInt.
     * Not meaningful `0` digits on the left of the expression can be omitted,
     * the returned address is always 20 bytes, 40 digits expression.
     *
     * @returns {Address} The converted hexadecimal unsigned integer.
     *
     * @throws {InvalidDataType} If the expression is not a valid hexadecimal positive integer expression.
     */
    static of(exp) {
        try {
            const huint = HexUInt_1.HexUInt.of(exp);
            const pad = HexUInt_1.HexUInt.of(huint.digits.padStart(40, '0'));
            const addressChecksummed = Address.checksum(pad);
            return new Address(Hex_1.Hex.POSITIVE, '0x0', // When we normalize we return the checksummed address as digits
            () => addressChecksummed.substring(2));
        }
        catch (error) {
            throw new sdk_errors_1.InvalidDataType('Address.of', 'not a valid hexadecimal positive integer expression', { exp: `${exp}` }, error);
        }
    }
    /**
     * Generates an Address object from the given private key.
     *
     * @param {Uint8Array} privateKey - The private key used to derive the corresponding address.
     * @return {Address} The derived Address object.
     * @throws {InvalidDataType} If the provided private key is invalid or cannot derive an address.
     */
    static ofPrivateKey(privateKey) {
        try {
            return Address.ofPublicKey(Secp256k1_1.Secp256k1.derivePublicKey(privateKey, true));
        }
        catch (error) {
            throw new sdk_errors_1.InvalidDataType('Address.ofPrivateKey', 'not a valid private key', { privateKey: 'private key is obfuscated' }, error);
        }
    }
    /**
     * Create an Address instance from the given public key.
     *
     * @param {Uint8Array} publicKey - The public key to convert.
     *
     * @returns {Address} The converted address.
     *
     * @remarks Security auditable method, depends on
     * * {@link Secp256k1.inflatePublicKey}.
     */
    static ofPublicKey(publicKey) {
        try {
            const publicKeyInflated = Secp256k1_1.Secp256k1.inflatePublicKey(publicKey);
            const publicKeyHash = Keccak256_1.Keccak256.of(publicKeyInflated.slice(1)).bytes;
            return Address.of(publicKeyHash.slice(12));
        }
        catch (error) {
            throw new sdk_errors_1.InvalidDataType('Address.ofPublicKey', 'not a valid public key', { publicKey: `${publicKey}` }, error);
        }
    }
    /**
     * Derives the address from a given list of words of
     * [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
     * and a [BIP44 Derivation Path](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
     * as in the examples.
     *
     * Secure audit function.
     * - {@link bip32.HDKey}(https://github.com/paulmillr/scure-bip32)
     * - {@link HDKey}
     *
     * @example `m/0` (default)
     * @example `m/0/2`
     * @example `m/0/2/4/6`
     *
     * @param {string[]} mnemonic - Mnemonic used to generate the HD node.
     * @param {string} [path='m/0'] - The derivation path from the current node.
     * @return {Address} - The derived address.
     * @throws {InvalidHDKey}
     *
     */
    static ofMnemonic(mnemonic, path = 'm/0') {
        const root = HDKey_1.HDKey.fromMnemonic(mnemonic);
        try {
            // Public key is always available.
            return Address.ofPublicKey(root.derive(path).publicKey);
        }
        catch (error) {
            throw new sdk_errors_1.InvalidHDKey('mnemonic.deriveAddress()', 'Invalid derivation path given as input.', { derivationPath: path }, error);
        }
    }
}
exports.Address = Address;
