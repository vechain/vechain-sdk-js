/**
 * Represents a VeChain Address as unsigned integer.
 *
 * @extends {HexUInt}
 */

import { secp256k1 } from '../secp256k1';
import { HexUInt } from './HexUInt';
import { keccak256 } from '../hash';

class Address extends HexUInt {
    /**
     * Regular expression pattern used to validate an address.
     *
     * @type {RegExp}
     */
    private static readonly REGEX_ADDRESS: RegExp = /^(0x)?[0-9a-f]{40}$/i;

    /**
     * Creates a new instance of this class to represent the absolute `hi` value.
     *
     * @param {HexUInt} huint - The HexUInt object representing the hexadecimal value.
     */
    protected constructor(huint: HexUInt) {
        super(huint);
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
            this.invalidDataTypeHandler(
                error,
                'Address.of',
                'not a valid hexadecimal positive integer expression',
                { exp: `${exp}`, error }
            );
        }
    }

    /**
     * Validate the given expression to be a valid address.
     * @param exp Expression to validate
     * @returns true if the expression is a valid address, false otherwise
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
            this.invalidDataTypeHandler(
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
            this.invalidDataTypeHandler(
                error,
                'Address.ofPublicKey',
                'not a valid public key',
                { publicKey: `${publicKey}`, error }
            );
        }
    }
}

export { Address };
