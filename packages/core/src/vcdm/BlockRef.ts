import { Hex } from './Hex';
import { HexUInt } from './HexUInt';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * The BlockRef class represents a Thor block ID value, which is a hexadecimal positive integer having 64 digits.
 *
 * @extends HexInt
 */
class BlockRef extends HexUInt {
    /**
     * Number of digits to represent a block reference value.
     *
     * @remarks The `0x` prefix is excluded.
     *
     * @type {number}
     */
    private static readonly DIGITS = 16;

    /**
     * Constructs a BlockRef object with the provided hexadecimal value.
     *
     * @param {HexUInt} huint - The hexadecimal value representing the BlockId.
     */
    protected constructor(huint: HexUInt) {
        super(Hex.POSITIVE, huint.fit(BlockRef.DIGITS).digits);
    }

    /**
     * Check if the given expression is a valid BlockRef.
     *
     * @param {string} exp - The expression to be validated.
     *
     * @return {boolean} Returns true if the expression is a valid BlockRef, false otherwise.
     */
    public static isValid(exp: string): boolean {
        return Hex.isValid(exp) && HexUInt.REGEX_HEXUINT_PREFIX.test(exp)
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
    public static isValid0x(exp: string): boolean {
        return HexUInt.REGEX_HEXUINT_PREFIX.test(exp) && BlockRef.isValid(exp);
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
    public static of(
        exp: bigint | number | string | Uint8Array | HexUInt
    ): BlockRef {
        try {
            if (exp instanceof HexUInt) {
                return new BlockRef(exp);
            }
            return new BlockRef(HexUInt.of(exp));
        } catch (e) {
            throw new InvalidDataType(
                'BlockRef.of',
                'not a BlockRef expression',
                { exp: `${exp}` }, // Needed to serialize bigint values.
                e
            );
        }
    }
}

export { BlockRef };
