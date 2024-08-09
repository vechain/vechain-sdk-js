import { Hex } from './Hex';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Represents a hexadecimal signed integer value.
 *
 * @description
 * Any non-meaningful zero digits are removed from the hexadecimal expression of this instance.
 *
 * @remark This class makes equal instances created from the same value as number or as bigint.
 *
 * @extends {Hex}
 */
class HexInt extends Hex {
    /**
     * Creates a new instance of this class to represent the `hex` value,
     * not meaningful zero digits are remved from the hexadecimal representation.
     *
     * @param {Hex} hex - The Hex object to be used for constructing a new instance.
     */
    protected constructor(hex: Hex) {
        let cue = 0;
        while (cue < hex.hex.length && hex.hex.at(cue) === '0') {
            cue++;
        }
        super(
            hex.sign,
            cue === hex.hex.length ? '0' : hex.hex.slice(cue, hex.hex.length)
        );
    }

    /**
     * Retrieves the value of n cast from this instance interpreted as the hexadecimal expression of a bigint value.
     *
     * @return {number} The value of n.
     *
     * @throws {InvalidDataType} If n is not within the safe number range, if the number representation of this
     * instance results approximated.
     *
     * @remark This class makes equal instances created from the same value as number or as bigint.
     */
    public override get n(): number {
        const bi = this.bi;
        if (Number.MIN_SAFE_INTEGER <= bi && bi <= Number.MAX_SAFE_INTEGER) {
            return Number(bi);
        }
        throw new InvalidDataType('HexInt.of', 'not in the safe number range', {
            bi: `${bi}`,
            hex: this.toString()
        });
    }

    /**
     * Create a HexInt instance from a bigint, number, string, Uint8Array, or {@link Hex}.
     *
     * @param {bigint | number | string | Uint8Array | Hex} exp - The value to convert to a HexInt instance:
     * * bigint is converted to its hexadecimal expression,
     * * number is cast to a bigint then converted to its hexadecimal expression,
     *   it throws {@link InvalidDataType} if not an integer value,
     * * string is parsed as a bigint hexadecimal expression,
     * * Uint8Array is interpreted as the sequence of bytes expressing a bigint value,
     *   then concerted to its hexadecimal expression,
     * * {@link Hex} is interpreted as expressing a bigint value.
     *
     * @returns {HexInt} - The converted HexInt object.
     *
     * @throws {InvalidDataType} - If the value is not a valid hexadecimal integer expression,
     * if `exp` is a not integer number.
     *
     * @remark This class makes equal instances created from the same value as number or as bigint.
     */
    public static of(exp: bigint | number | string | Uint8Array | Hex): HexInt {
        try {
            if (exp instanceof Hex) {
                return new HexInt(exp);
            }
            if (typeof exp === 'number') {
                if (Number.isInteger(exp)) {
                    return new HexInt(Hex.of(BigInt(exp)));
                }
                // noinspection ExceptionCaughtLocallyJS
                throw new InvalidDataType('HexInt.of', 'not an integer', {
                    exp
                });
            }
            return new HexInt(Hex.of(exp));
        } catch (e) {
            throw new InvalidDataType(
                'HexInt.of',
                'not an hexadecimal integer expression',
                { exp: `${exp}`, e } // Needed to serialize bigint values.
            );
        }
    }
}

export { HexInt };
