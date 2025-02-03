import { Hex } from './Hex';
import { type HexInt } from './HexInt';
import { HexUInt32 } from './HexUInt32';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * The BlockId class represents a Thor block ID value, which is a hexadecimal positive integer having 64 digits.
 *
 * @extends HexUInt32
 */
class BlockId extends HexUInt32 {
    /**
     * Constructs a BlockId object with the provided hexadecimal value.
     *
     * @param {HexUInt32} hexUInt32 - The hexadecimal value representing the BlockId.
     */
    protected constructor(hexUInt32: HexUInt32) {
        super(Hex.POSITIVE, hexUInt32.digits);
    }
    /**
     * Creates a new BlockId object from the given expression.
     *
     * @param {bigint | number | string | HexInt | Uint8Array} exp - The expression to create the BlockId from.
     *     It can be one of the following types:
     *     - bigint: A BigInteger value that represents the BlockId.
     *     - number: A number value that represents the BlockId.
     *     - string: A string value that represents the BlockId.
     *     - HexInt: A HexInt object that represents the BlockId.
     *     - Uint8Array: A Uint8Array object that represents the BlockId.
     *
     * @returns {BlockId} - A new BlockId object created from the given expression.
     *
     * @throws {InvalidDataType} If the given expression is not a valid hexadecimal positive integer expression.
     */
    public static of(
        exp: bigint | number | string | Uint8Array | HexInt
    ): BlockId {
        try {
            if (exp instanceof HexUInt32) {
                return new BlockId(exp);
            }
            return new BlockId(HexUInt32.of(exp));
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

export { BlockId };
