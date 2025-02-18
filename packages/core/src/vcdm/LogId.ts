import { Hex } from './Hex';
import { type HexInt } from './HexInt';
import { HexUInt32 } from './HexUInt32';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * The LogId class represents a Thor event log ID, which is a hexadecimal positive integer having 64 digits.
 *
 * @extends HexUInt32
 */
class LogId extends HexUInt32 {
    /**
     * Constructs a LogId object with the provided hexadecimal value.
     *
     * @param {HexUInt32} hexUInt32 - The hexadecimal value representing the LogId.
     */
    protected constructor(hexUInt32: HexUInt32) {
        super(Hex.POSITIVE, hexUInt32.digits);
    }
    /**
     * Creates a new LogId object from the given expression.
     *
     * @param {bigint | number | string | HexInt | Uint8Array} exp - The expression to create the LogId from.
     *     It can be one of the following types:
     *     - bigint: A BigInteger value that represents the LogId.
     *     - number: A number value that represents the LogId.
     *     - string: A string value that represents the LogId.
     *     - HexInt: A HexInt object that represents the LogId.
     *     - Uint8Array: A Uint8Array object that represents the LogId.
     *
     * @returns {LogId} - A new LogId object created from the given expression.
     *
     * @throws {InvalidDataType} If the given expression is not a valid hexadecimal positive integer expression.
     */
    public static of(
        exp: bigint | number | string | Uint8Array | HexInt
    ): LogId {
        try {
            if (exp instanceof HexUInt32) {
                return new LogId(exp);
            }
            return new LogId(HexUInt32.of(exp));
        } catch (e) {
            throw new InvalidDataType(
                'LogId.of',
                'not a LogId expression',
                { exp: `${exp}` }, // Needed to serialize bigint values.
                e
            );
        }
    }
}

export { LogId };
