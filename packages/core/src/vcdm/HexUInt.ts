import { HexInt } from './HexInt';
import { Hex } from './Hex';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Represents a hexadecimal unsigned integer value.
 *
 * @extends HexInt
 */
class HexUInt extends HexInt {
    /**
     * Create a HexUInt instance from a bigint, number, string, Uint8Array, or {@link HexInt}.
     *
     * @param {bigint | number | string | Uint8Array | HexInt} exp - The expression to be interpreted as an unsigned integer:
     * * bigint is always representable in hexadecimal base notation,
     *   it throws {@link InvalidDataType} if not positive;
     * * number is converted to a bigint then represented in hexadecimal base notation,
     *   it throws {@link InvalidDataType} if not a positive integer value;
     * * string is parsed as the hexadecimal expression of a bigint value, optionally tagged with `0x`;
     *   it throws {@link InvalidDataType} if not positive;
     * * Uint8Array is interpreted as the sequence of bytes expressing a positive bigint value;
     * * {@link HexInt} is interpreted as expressing a bigint value,
     *   it throws {@link InvalidDataType} if not positive.
     *
     * @returns {HexUInt} he new HexInt object representing the given `exp`.
     *
     * @throws {InvalidDataType} If the given expression is not a valid hexadecimal positive integer expression.
     */
    public static of(
        exp: bigint | number | string | Uint8Array | HexInt
    ): HexUInt {
        try {
            const hxi = HexInt.of(exp);
            if (hxi.sign >= Hex.POSITIVE) {
                return new HexUInt(hxi.sign, hxi.digits);
            }
            throw new InvalidDataType(
                'HexUInt.of',
                'not positive',
                { exp: `${exp}` } // Needed to serialize bigint values.
            );
        } catch (e) {
            throw new InvalidDataType(
                'HexUInt.of',
                'not a hexadecimal positive integer expression',
                { exp: `${exp}`, e }, // Needed to serialize bigint values.
                e
            );
        }
    }
}

export { HexUInt };
