"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThorId = exports.BlockId = void 0;
const Hex_1 = require("./Hex");
const HexUInt_1 = require("./HexUInt");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * The BlockId class represents a Thor block ID value, which is a hexadecimal positive integer having 64 digits.
 *
 * @extends HexInt
 */
class BlockId extends HexUInt_1.HexUInt {
    /**
     * Number of digits to represent a Thor block ID value.
     *
     * @remarks The `0x` prefix is excluded.
     *
     * @type {number}
     */
    static DIGITS = 64;
    /**
     * Constructs a BlockId object with the provided hexadecimal value.
     *
     * @param {HexUInt} huint - The hexadecimal value representing the BlockId.
     */
    constructor(huint) {
        super(Hex_1.Hex.POSITIVE, huint.fit(BlockId.DIGITS).digits);
    }
    /**
     * Check if the given expression is a valid BlockId.
     *
     * @param {string} exp - The expression to be validated.
     *
     * @return {boolean} Returns true if the expression is a valid BlockId, false otherwise.
     */
    static isValid(exp) {
        return Hex_1.Hex.isValid(exp) && HexUInt_1.HexUInt.REGEX_HEXUINT_PREFIX.test(exp)
            ? exp.length === BlockId.DIGITS + 2
            : exp.length === BlockId.DIGITS;
    }
    /**
     * Determines whether the given string is a valid hex number prefixed with '0x'.
     *
     * @param {string} exp - The hex number to be checked.
     *
     *  @returns {boolean} - True if the hex number is valid, false otherwise.
     */
    static isValid0x(exp) {
        return HexUInt_1.HexUInt.REGEX_HEXUINT_PREFIX.test(exp) && BlockId.isValid(exp);
    }
    /**
     * Creates a new BlockId object from the given expression.
     *
     * @param {bigint | number | string | Hex | Uint8Array} exp - The expression to create the BlockId from.
     *     It can be one of the following types:
     *     - bigint: A BigInteger value that represents the BlockId.
     *     - number: A number value that represents the BlockId.
     *     - string: A string value that represents the BlockId.
     *     - HexUInt: A HexUInt object that represents the BlockId.
     *     - Uint8Array: A Uint8Array object that represents the BlockId.
     *
     * @returns {BlockId} - A new BlockId object created from the given expression.
     *
     * @throws {InvalidDataType} If the given expression is not a valid hexadecimal positive integer expression.
     */
    static of(exp) {
        try {
            if (exp instanceof HexUInt_1.HexUInt) {
                return new BlockId(exp);
            }
            return new BlockId(HexUInt_1.HexUInt.of(exp));
        }
        catch (e) {
            throw new sdk_errors_1.InvalidDataType('BlockId.of', 'not a BlockId expression', { exp: `${exp}` }, // Needed to serialize bigint values.
            e);
        }
    }
}
exports.BlockId = BlockId;
/**
 * This class is an alias of {@link BlockId} for back compatibility.
 */
class ThorId extends BlockId {
    /**
     * Constructs an instance of the class with the specified block ID.
     *
     * @param {BlockId} blockId - The unique identifier for the block.
     */
    constructor(blockId) {
        super(blockId);
    }
    /**
     * See {@link BlockId.of}.
     */
    static of(exp) {
        return new ThorId(BlockId.of(exp));
    }
}
exports.ThorId = ThorId;
