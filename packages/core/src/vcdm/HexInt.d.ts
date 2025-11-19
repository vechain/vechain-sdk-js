import { Hex } from './Hex';
/**
 * Represents a hexadecimal signed integer value.
 *
 * @remarks This class makes equal instances created from the same value as number or as bigint.
 *
 * @extends {Hex}
 */
declare class HexInt extends Hex {
    /**
     * Retrieves the value of n cast from this instance interpreted as the hexadecimal expression of a bigint value.
     *
     * @return {number} The value of n.
     *
     * @throws {InvalidDataType} If n is not within the safe number range, if the number representation of this
     * instance results approximated.
     *
     * @remarks This class makes equal instances created from the same value as number or as bigint.
     */
    get n(): number;
    /**
     * Create a HexInt instance from a bigint, number, string, Uint8Array, or {@link Hex}.
     *
     * @param {bigint | number | string | Uint8Array | Hex} exp - The expression to be interpreted as an integer:
     * * bigint is always representable in hexadecimal base notation;
     * * number is converted to a bigint then represented in hexadecimal base notation;
     *   it throws {@link InvalidDataType} if not an integer value;
     * * string is parsed as the hexadecimal expression of a bigint value, optionally tagged with `0x`;
     * * Uint8Array is interpreted as the sequence of bytes expressing a bigint value;
     * * {@link Hex} is interpreted as expressing a bigint value.
     *
     * @returns {HexInt} - The new HexInt object representing the given `exp`.
     *
     * @throws {InvalidDataType} - If the given `exp` is not a valid hexadecimal integer expression,
     * if `exp` is a not integer number.
     *
     * @remarks This class makes equal instances created from the same value as number or as bigint.
     */
    static of(exp: bigint | number | string | Uint8Array | Hex): HexInt;
}
export { HexInt };
//# sourceMappingURL=HexInt.d.ts.map