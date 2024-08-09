/**
 * Represents a VeChain Address as unsigned integer.
 *
 * @extends {HexUInt}
 */

import { HexUInt } from './HexUInt';

class Address extends HexUInt {
    /**
     * Creates a new instance of this class to represent the absolute `hi` value.
     *
     * @param {HexUInt} hi - The HexUInt object representing the hexadecimal value.
     */
    protected constructor(hi: HexUInt) {
        super(hi);
    }

    /**
     * Create a Address instance from the given expression interprete as an unsigned integer.
     *
     * @param exp The expression to convert. It can be of type bigint, number, string, Uint8Array, or HexUInt.
     *
     * @returns {Address} The converted hexadecimal unsigned integer.
     */
    public static of(
        exp: bigint | number | string | Uint8Array | HexUInt
    ): Address {
        try {
            return new Address(HexUInt.of(exp));
        } catch (error) {
            this.errorHandler(
                error,
                'Address.of',
                'not a valid hexadecimal positive integer expression',
                { exp: `${exp}`, error }
            );
        }
    }

    /**
     * Create a Address instance from the given expression interpreted as an unsigned integer.
     *
     * @param exp The expression to convert. It can be of type bigint, number, string, Uint8Array, or HexUInt.
     *
     * @returns {Address} The converted hexadecimal unsigned integer.
     */
    public static from(
        exp: bigint | number | string | Uint8Array | HexUInt
    ): Address {
        return new Address(HexUInt.of(exp));
    }
}

export { Address };
