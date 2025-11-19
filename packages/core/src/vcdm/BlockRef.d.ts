import { HexUInt } from './HexUInt';
/**
 * The BlockRef class represents a Thor block ID value, which is a hexadecimal positive integer having 64 digits.
 *
 * @extends HexInt
 */
declare class BlockRef extends HexUInt {
    /**
     * Number of digits to represent a block reference value.
     *
     * @remarks The `0x` prefix is excluded.
     *
     * @type {number}
     */
    private static readonly DIGITS;
    /**
     * Constructs a BlockRef object with the provided hexadecimal value.
     *
     * @param {HexUInt} huint - The hexadecimal value representing the BlockId.
     */
    protected constructor(huint: HexUInt);
    /**
     * Check if the given expression is a valid BlockRef.
     *
     * @param {string} exp - The expression to be validated.
     *
     * @return {boolean} Returns true if the expression is a valid BlockRef, false otherwise.
     */
    static isValid(exp: string): boolean;
    /**
     * Determines whether the given string is a valid hex number prefixed with '0x'.
     *
     * @param {string} exp - The hex number to be checked.
     *
     *  @returns {boolean} - True if the hex number is valid, false otherwise.
     */
    static isValid0x(exp: string): boolean;
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
    static of(exp: bigint | number | string | Uint8Array | HexUInt): BlockRef;
}
export { BlockRef };
//# sourceMappingURL=BlockRef.d.ts.map