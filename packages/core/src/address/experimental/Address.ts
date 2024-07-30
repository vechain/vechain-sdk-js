import * as nc_utils from '@noble/curves/abstract/utils';
import { HEX } from '../../utils';
import { secp256k1 } from '../../secp256k1';
import { keccak256 } from '../../hash';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Represents an address in Ethereum/Thor.
 *
 * @class Address
 * @extends HEX
 */
class Address extends HEX {
    /**
     * Regular expression pattern used to validate an address.
     *
     * @type {RegExp}
     */
    private static readonly REGEX_ADDRESS = /^(0x)?[0-9a-f]{40}$/i;

    /**
     * Creates a new instance of the Address class.
     *
     * @param {string} hex - The hexadecimal address expression.
     * @throws {InvalidDataType} if the hexadecimal expression is not an Ethereum/Thor address.
     */
    constructor(hex: string) {
        if (Address.isValid(hex)) {
            super(hex, (hex: string) => Address.checksum(hex));
        } else
            throw new InvalidDataType(
                'Address.constructor',
                'not an address expression',
                { hex }
            );
    }

    /**
     * Calculates the checksum of a given hexadecimal expression according the
     * [ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).
     *
     * @param {string} hex - The text to calculate the checksum for.
     * @returns {string} The calculated checksum.
     * @private
     * @remark Secure Audit Function:
     * - {@link keccak256},
     * - {@link nc_utils.bytesToHex}.
     */
    private static checksum(hex: string): string {
        const lowc = hex.toLowerCase();
        const hash = nc_utils.bytesToHex(keccak256(lowc));
        let checksum = '';
        for (let i = 0; i < lowc.length; i++) {
            if (parseInt(hash[i], HEX.RADIX) >= 8) {
                checksum += lowc[i].toUpperCase();
            } else {
                checksum += lowc[i];
            }
        }
        return checksum;
    }

    /**
     * Checks if the given string is an Ethereum/Thor address expression:
     * 40 hexadecimal digits (20 bytes) optionally prefixed with `0x`.
     *
     * @param {string} exp - The string to be checked for validity.
     * @returns {boolean} - Returns true if the string is an Ethereum/Thor address expression,
     *                      otherwise returns false.
     */
    public static isValid(exp: string): boolean {
        return Address.REGEX_ADDRESS.test(exp);
    }

    /**
     * Creates an Address object from a Uint8Array value.
     *
     * @param {Uint8Array} value - The Uint8Array value used to create the Address object.
     * @return {Address} - The Address object created from the provided value.
     * @throws {InvalidDataType} if the hexadecimal expression is not an Ethereum/Thor address.
     */
    public static of(value: Uint8Array): Address {
        return new Address(nc_utils.bytesToHex(value));
    }

    /**
     * Generates an Address from a private key.
     *
     * @param {Uint8Array} privateKey - The private key used to derive the public key.
     * @return {Address} - The generated Address.
     * @throws {InvalidSecp256k1PrivateKey} if `privateKey` is invalid.
     *
     * @remark Security Audited Function:
     * - {@link ofPublicKey},
     * - {@link secp256k1.derivePublicKey}.
     */
    public static ofPrivateKey(privateKey: Uint8Array): Address {
        return Address.ofPublicKey(secp256k1.derivePublicKey(privateKey));
    }

    /**
     * Generates an Address instance from a public key.
     *
     * @param {Uint8Array} publicKey - The public key to generate the address from.
     * @returns {Address} - The generated address.
     *
     * @remark Security Audited Function:
     * - {secp256k1.inflatePublicKey}.
     */
    public static ofPublicKey(publicKey: Uint8Array): Address {
        return Address.of(
            keccak256(secp256k1.inflatePublicKey(publicKey).slice(1)).slice(12)
        );
    }
}

export { Address };
