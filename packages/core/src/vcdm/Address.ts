import { HDKey } from '../hdkey/HDKey';
import { Hex } from './Hex';
import { HexUInt } from './HexUInt';
import { InvalidDataType, InvalidHDKey } from '@vechain/sdk-errors';
import { Keccak256 } from './hash/Keccak256';
import { Secp256k1 } from '../secp256k1/Secp256k1';
import { Txt } from './Txt';

/**
 * Represents a VeChain Address as unsigned integer.
 *
 * @extends {HexUInt}
 */
class Address extends HexUInt {
    /**
     * The address is 20 bytes hence 40 digits long.
     */
    public static readonly DIGITS: number = 40;

    /**
     * It checksums a given hexadecimal address.
     *
     * @param {HexUInt} huint - The HexUInt object representing the hexadecimal value.
     *
     * @returns {string} The checksummed address.
     */
    public static checksum(huint: HexUInt): string {
        const stringAddress: string = huint.digits;
        const hash: string = Keccak256.of(Txt.of(stringAddress).bytes).digits;

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
    public static isValid(exp: string): boolean {
        return Hex.isValid0x(exp) && exp.length === Address.DIGITS + 2;
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
    public static of(
        exp: bigint | number | string | Uint8Array | HexUInt
    ): Address {
        try {
            const huint = HexUInt.of(exp);
            const pad = HexUInt.of(huint.digits.padStart(40, '0'));
            const addressChecksummed: string = Address.checksum(pad);
            return new Address(
                Hex.POSITIVE,
                '0x0', // When we normalize we return the checksummed address as digits
                () => addressChecksummed.substring(2)
            );
        } catch (error) {
            throw new InvalidDataType(
                'Address.of',
                'not a valid hexadecimal positive integer expression',
                { exp: `${exp}` },
                error
            );
        }
    }

    /**
     * Generates an Address object from the given private key.
     *
     * @param {Uint8Array} privateKey - The private key used to derive the corresponding address.
     * @return {Address} The derived Address object.
     * @throws {InvalidDataType} If the provided private key is invalid or cannot derive an address.
     */
    public static ofPrivateKey(privateKey: Uint8Array): Address {
        try {
            return Address.ofPublicKey(
                Secp256k1.derivePublicKey(privateKey, true)
            );
        } catch (error) {
            throw new InvalidDataType(
                'Address.ofPrivateKey',
                'not a valid private key',
                { privateKey: 'private key is obfuscated' },
                error
            );
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
    public static ofPublicKey(publicKey: Uint8Array): Address {
        try {
            const publicKeyInflated = Secp256k1.inflatePublicKey(publicKey);
            const publicKeyHash = Keccak256.of(
                publicKeyInflated.slice(1)
            ).bytes;
            return Address.of(publicKeyHash.slice(12));
        } catch (error) {
            throw new InvalidDataType(
                'Address.ofPublicKey',
                'not a valid public key',
                { publicKey: `${publicKey}` },
                error
            );
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
    public static ofMnemonic(
        mnemonic: string[],
        path: string = 'm/0'
    ): Address {
        const root = HDKey.fromMnemonic(mnemonic);
        try {
            // Public key is always available.
            return Address.ofPublicKey(
                root.derive(path).publicKey as Uint8Array
            );
        } catch (error) {
            throw new InvalidHDKey(
                'mnemonic.deriveAddress()',
                'Invalid derivation path given as input.',
                { derivationPath: path },
                error
            );
        }
    }
}

export { Address };
