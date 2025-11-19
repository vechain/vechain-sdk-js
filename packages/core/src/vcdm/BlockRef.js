"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockRef = void 0;
const Hex_1 = require("./Hex");
const HexUInt_1 = require("./HexUInt");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * The BlockRef class represents a Thor block ID value, which is a hexadecimal positive integer having 64 digits.
 *
 * @extends HexInt
 */
class BlockRef extends HexUInt_1.HexUInt {
    /**
     * Number of digits to represent a block reference value.
     *
     * @remarks The `0x` prefix is excluded.
     *
     * @type {number}
     */
    static DIGITS = 16;
    /**
     * Constructs a BlockRef object with the provided hexadecimal value.
     *
     * @param {HexUInt} huint - The hexadecimal value representing the BlockId.
     */
    constructor(huint) {
        super(Hex_1.Hex.POSITIVE, huint.fit(BlockRef.DIGITS).digits);
    }
    /**
     * Check if the given expression is a valid BlockRef.
     *
     * @param {string} exp - The expression to be validated.
     *
     * @return {boolean} Returns true if the expression is a valid BlockRef, false otherwise.
     */
    static isValid(exp) {
        return Hex_1.Hex.isValid(exp) && HexUInt_1.HexUInt.REGEX_HEXUINT_PREFIX.test(exp)
            ? exp.length === BlockRef.DIGITS + 2
            : exp.length === BlockRef.DIGITS;
    }
    /**
     * Determines whether the given string is a valid hex number prefixed with '0x'.
     *
     * @param {string} exp - The hex number to be checked.
     *
     *  @returns {boolean} - True if the hex number is valid, false otherwise.
     */
    static isValid0x(exp) {
        return HexUInt_1.HexUInt.REGEX_HEXUINT_PREFIX.test(exp) && BlockRef.isValid(exp);
    }
    /**
     * Creates a new BlockRef object from the given expression.
     *
     * @param {bigint | number | string | Hex | Uint8Array} exp - The expression to create the BlockRef from.
     *     It can be one of the following types:
     *     - bigint: A BigInteger value that represents the BlockRef.
     *     - number: A number value that represents the BlockRef.
     *     - string: A string value that represents the BlockRef.
     *     - HexUInt: A HexUInt object that represents the BlockRef.
     *     - Uint8Array: A Uint8Array object that represents the BlockRef.
     *
     * @returns {BlockRef} - A new BlockRef object created from the given expression.
     *
     * @throws {InvalidDataType} If the given expression is not a valid hexadecimal positive integer expression.
     */
    static of(exp) {
        try {
            if (exp instanceof HexUInt_1.HexUInt) {
                return new BlockRef(exp);
            }
            return new BlockRef(HexUInt_1.HexUInt.of(exp));
        }
        catch (e) {
            throw new sdk_errors_1.InvalidDataType('BlockRef.of', 'not a BlockRef expression', { exp: `${exp}` }, // Needed to serialize bigint values.
            e);
        }
    }
}
exports.BlockRef = BlockRef;
