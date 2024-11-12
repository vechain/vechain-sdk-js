import { Hex } from './Hex';
import { HexUInt } from './HexUInt';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * The BlockId class represents a Thor block ID value, which is a hexadecimal positive integer having 64 digits.
 *
 * @extends HexInt
 */
class BlockId extends HexUInt {
    /**
     * Number of digits to represent a Thor block ID value.
     *
     * @remarks The `0x` prefix is excluded.
     *
     * @type {number}
     */
    private static readonly DIGITS = 64;

    /**
     * Constructs a BlockId object with the provided hexadecimal value.
     *
     * @param {HexUInt} huint - The hexadecimal value representing the BlockId.
     */
    protected constructor(huint: HexUInt) {
        super(Hex.POSITIVE, huint.fit(BlockId.DIGITS).digits);
    }

    /**
     * Check if the given expression is a valid BlockId.
     *
     * @param {string} exp - The expression to be validated.
     *
     * @return {boolean} Returns true if the expression is a valid BlockId, false otherwise.
     */
    public static isValid(exp: string): boolean {
        return Hex.isValid(exp) && HexUInt.REGEX_HEXUINT_PREFIX.test(exp)
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
    public static isValid0x(exp: string): boolean {
        return HexUInt.REGEX_HEXUINT_PREFIX.test(exp) && BlockId.isValid(exp);
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
    public static of(
        exp: bigint | number | string | Uint8Array | HexUInt
    ): BlockId {
        try {
            if (exp instanceof HexUInt) {
                return new BlockId(exp);
            }
            return new BlockId(HexUInt.of(exp));
        } catch (e) {
            throw new InvalidDataType(
                'BlockId.of',
                'not a BlockId expression',
                { exp: `${exp}` }, // Needed to serialize bigint values.
                e
            );
        }
    }
}

/**
 * This class is an alias of {@link BlockId} for back compatibility.
 */
class ThorId extends BlockId {
    /**
     * Constructs an instance of the class with the specified block ID.
     *
     * @param {BlockId} blockId - The unique identifier for the block.
     */
    protected constructor(blockId: BlockId) {
        super(blockId);
    }

    /**
     * See {@link BlockId.of}.
     */
    public static of(
        exp: bigint | number | string | Uint8Array | HexUInt
    ): ThorId {
        return new ThorId(BlockId.of(exp));
    }
}

export { BlockId, ThorId };
