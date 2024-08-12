/**
 * Represents a VeChain Address as unsigned integer.
 *
 * @extends {HexUInt}
 */

import { bytesToHex } from '@noble/ciphers/utils';
import { InvalidDataType } from '@vechain/sdk-errors';
import { keccak256 } from '../hash';
import { secp256k1 } from '../secp256k1';
import { HexUInt } from './HexUInt';

class Address extends HexUInt {
    /**
     * Regular expression pattern used to validate an address.
     *
     * @type {RegExp}
     */
    private static readonly REGEX_ADDRESS: RegExp = /^(0x)?[0-9a-fA-F]{40}$/i;

    /**
     * Creates a new instance of this class to represent the absolute `hi` value.
     *
     * @param {HexUInt} huint - The HexUInt object representing the hexadecimal value.
     * @throws {InvalidDataType} Throws an error if huint is an invalid address.
     */
    protected constructor(huint: HexUInt) {
        if (Address.isValid(huint.hex)) {
            const addressChecksummed: string = Address.checksum(huint.hex);
            super(HexUInt.of(addressChecksummed));
        } else {
            throw new InvalidDataType(
                'Address.constructor',
                'not a valid address',
                {
                    huint
                }
            );
        }
    }

    /**
     * It checksums a given hexadecimal address.
     * @param {string} stringAddress String representation of the address (lower case).
     * @returns {string} The checksummed address.
     */
    private static checksum(stringAddress: string): string {
        const hash: string = bytesToHex(keccak256(stringAddress));
        let checksum = '';
        for (let i = 0; i < stringAddress.length; i++) {
            checksum +=
                parseInt(hash[i], 16) > 7
                    ? stringAddress[i].toUpperCase()
                    : stringAddress[i];
        }

        return checksum;
    }

    /**
     * Create a Address instance from the given expression interprete as an unsigned integer.
     *
     * @param exp The expression to convert. It can be of type bigint, number, string, Uint8Array, or HexUInt.
     *
     * @returns {Address} The converted hexadecimal unsigned integer.
     * @throws {InvalidDataType} If the expression is not a valid hexadecimal positive integer expression.
     */
    public static of(
        exp: bigint | number | string | Uint8Array | HexUInt
    ): Address {
        try {
            return new Address(HexUInt.of(exp));
        } catch (error) {
            this.throwInvalidDataType(
                error,
                'Address.of',
                'not a valid hexadecimal positive integer expression',
                { exp: `${exp}`, error }
            );
        }
    }

    /**
     * Validate the given expression to be a valid address.
     * @param {string} exp Expression to validate
     * @returns {boolean} true if the expression is a valid address, false otherwise
     */

    public static isValid(exp: string): boolean {
        return Address.REGEX_ADDRESS.test(exp);
    }

    /**
     * Create a Address instance from the given private key.
     *
     * @param {Uint8Array} privateKey The private key to convert.
     * @param {boolean} [isCompressed=true] The flag to indicate if the derived public key should be compressed.
     * @returns {Address} The converted address.
     */
    public static ofPrivateKey(
        privateKey: Uint8Array,
        isCompressed: boolean = true
    ): Address {
        try {
            return Address.ofPublicKey(
                secp256k1.derivePublicKey(privateKey, isCompressed)
            );
        } catch (error) {
            this.throwInvalidDataType(
                error,
                'Address.ofPrivateKey',
                'not a valid private key',
                { privateKey: `${privateKey}`, error }
            );
        }
    }

    /**
     * Create a Address instance from the given public key.
     *
     * @param {Uint8Array} publicKey The public key to convert.
     * @returns {Address} The converted address.
     */
    public static ofPublicKey(publicKey: Uint8Array): Address {
        try {
            const publicKeyInflated = secp256k1.inflatePublicKey(publicKey);
            const publicKeyHash = keccak256(publicKeyInflated.slice(1));
            return Address.of(publicKeyHash.slice(12));
        } catch (error) {
            this.throwInvalidDataType(
                error,
                'Address.ofPublicKey',
                'not a valid public key',
                { publicKey: `${publicKey}`, error }
            );
        }
    }
}

export { Address };
