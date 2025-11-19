import { HexUInt } from './HexUInt';
/**
 * Represents a VeChain Address as unsigned integer.
 *
 * @extends {HexUInt}
 */
declare class Address extends HexUInt {
    /**
     * The address is 20 bytes hence 40 digits long.
     */
    static readonly DIGITS: number;
    /**
     * It checksums a given hexadecimal address.
     *
     * @param {HexUInt} huint - The HexUInt object representing the hexadecimal value.
     *
     * @returns {string} The checksummed address.
     */
    static checksum(huint: HexUInt): string;
    /**
     * Validate the given expression to be a valid address.
     *
     *  @param {string} exp - Expression to validate
     *
     * @returns {boolean} true if the expression is a valid address, false otherwise
     */
    static isValid(exp: string): boolean;
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
    static of(exp: bigint | number | string | Uint8Array | HexUInt): Address;
    /**
     * Generates an Address object from the given private key.
     *
     * @param {Uint8Array} privateKey - The private key used to derive the corresponding address.
     * @return {Address} The derived Address object.
     * @throws {InvalidDataType} If the provided private key is invalid or cannot derive an address.
     */
    static ofPrivateKey(privateKey: Uint8Array): Address;
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
    static ofPublicKey(publicKey: Uint8Array): Address;
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
    static ofMnemonic(mnemonic: string[], path?: string): Address;
}
export { Address };
//# sourceMappingURL=Address.d.ts.map