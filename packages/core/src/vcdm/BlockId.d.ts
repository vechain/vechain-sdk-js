import { HexUInt } from './HexUInt';
/**
 * The BlockId class represents a Thor block ID value, which is a hexadecimal positive integer having 64 digits.
 *
 * @extends HexInt
 */
declare class BlockId extends HexUInt {
    /**
     * Number of digits to represent a Thor block ID value.
     *
     * @remarks The `0x` prefix is excluded.
     *
     * @type {number}
     */
    private static readonly DIGITS;
    /**
     * Constructs a BlockId object with the provided hexadecimal value.
     *
     * @param {HexUInt} huint - The hexadecimal value representing the BlockId.
     */
    protected constructor(huint: HexUInt);
    /**
     * Check if the given expression is a valid BlockId.
     *
     * @param {string} exp - The expression to be validated.
     *
     * @return {boolean} Returns true if the expression is a valid BlockId, false otherwise.
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
    static of(exp: bigint | number | string | Uint8Array | HexUInt): BlockId;
}
/**
 * This class is an alias of {@link BlockId} for back compatibility.
 */
declare class ThorId extends BlockId {
    /**
     * Constructs an instance of the class with the specified block ID.
     *
     * @param {BlockId} blockId - The unique identifier for the block.
     */
    protected constructor(blockId: BlockId);
    /**
     * See {@link BlockId.of}.
     */
    static of(exp: bigint | number | string | Uint8Array | HexUInt): ThorId;
}
export { BlockId, ThorId };
//# sourceMappingURL=BlockId.d.ts.map