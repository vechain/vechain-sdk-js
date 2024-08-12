import { HexInt } from './HexInt';
import { Hex } from './Hex';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Represents a hexadecimal unsigned integer.
 *
 * @extends HexInt
 */
class HexUInt extends HexInt {
    /**
     * Create a HexUInt instance from the given expression interprete as an unsigned integer.
     *
     * @param exp The expression to convert. It can be of type bigint, number, string, Uint8Array, or HexInt.
     *
     * @returns {HexUInt} The converted hexadecimal unsigned integer.
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
