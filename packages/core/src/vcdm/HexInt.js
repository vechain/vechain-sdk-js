"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexInt = void 0;
const Hex_1 = require("./Hex");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Represents a hexadecimal signed integer value.
 *
 * @remarks This class makes equal instances created from the same value as number or as bigint.
 *
 * @extends {Hex}
 */
class HexInt extends Hex_1.Hex {
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
    get n() {
        const bi = this.bi;
        if (Number.MIN_SAFE_INTEGER <= bi && bi <= Number.MAX_SAFE_INTEGER) {
            return Number(bi);
        }
        throw new sdk_errors_1.InvalidDataType('HexInt.n', 'not in the safe number range', {
            bi: `${bi}`,
            hex: this.toString()
        });
    }
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
    static of(exp) {
        try {
            if (exp instanceof Hex_1.Hex) {
                return new HexInt(exp.sign, exp.digits);
            }
            if (typeof exp === 'number') {
                if (Number.isInteger(exp)) {
                    const hex = Hex_1.Hex.of(BigInt(exp));
                    return new HexInt(hex.sign, hex.digits);
                }
                // noinspection ExceptionCaughtLocallyJS
                throw new sdk_errors_1.InvalidDataType('HexInt.of', 'not an integer', {
                    exp
                });
            }
            const hex = Hex_1.Hex.of(exp);
            return new HexInt(hex.sign, hex.digits);
        }
        catch (e) {
            throw new sdk_errors_1.InvalidDataType('HexInt.of', 'not an hexadecimal integer expression', { exp: `${exp}`, e } // Needed to serialize bigint values.
            );
        }
    }
}
exports.HexInt = HexInt;
