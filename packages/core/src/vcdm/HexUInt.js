"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexUInt = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const Hex_1 = require("./Hex");
const HexInt_1 = require("./HexInt");
/**
 * Represents a hexadecimal unsigned integer value.
 *
 * @extends HexInt
 */
class HexUInt extends HexInt_1.HexInt {
    /**
     * Regular expression for matching hexadecimal strings.
     * An empty input is represented as a empty digits.
     *
     * @type {RegExp}
     */
    static REGEX_HEXUINT = /^(0x)?[0-9a-f]*$/i;
    /**
     * Regular expression pattern to match a prefix indicating hexadecimal number.
     *
     * @type {RegExp}
     */
    static REGEX_HEXUINT_PREFIX = /^0x/i;
    /**
     * Checks if the given string expression is a valid unsigned hexadecimal value.
     *
     * @param {string} exp - The string representation of a hexadecimal value.
     *
     * @return {boolean} - True if the expression is a valid unsigned hexadecimal value, case-insensitive,
     * optionally prefixed with `0x`; false otherwise.
     */
    static isValid(exp) {
        return HexUInt.REGEX_HEXUINT.test(exp);
    }
    /**
     * Determines whether the given string is a valid unsigned hexadecimal number prefixed with '0x'.
     *
     * @param {string} exp - The string to be evaluated.
     * @return {boolean} - True if the string is a valid unsigned hexadecimal number prefixed with '0x', otherwise false.
     */
    static isValid0x(exp) {
        return HexUInt.REGEX_HEX_PREFIX.test(exp) && Hex_1.Hex.isValid(exp);
    }
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
    static of(exp) {
        try {
            const hint = HexInt_1.HexInt.of(exp);
            if (hint.sign >= Hex_1.Hex.POSITIVE) {
                return new HexUInt(hint.sign, hint.digits);
            }
            throw new sdk_errors_1.InvalidDataType('HexUInt.of', 'not positive', { exp: `${exp}` } // Needed to serialize bigint values.
            );
        }
        catch (e) {
            throw new sdk_errors_1.InvalidDataType('HexUInt.of', 'not a hexadecimal positive integer expression', { exp: `${exp}`, e }, // Needed to serialize bigint values.
            e);
        }
    }
}
exports.HexUInt = HexUInt;
