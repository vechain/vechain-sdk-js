import { Hex } from './Hex';
import { type HexInt } from './HexInt';
import { HexUInt32 } from './HexUInt32';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * The TxId class represents a Thor transaction ID value, which is a hexadecimal positive integer having 64 digits.
 *
 * @extends HexUInt32
 */
class TxId extends HexUInt32 {
    /**
     * Constructs a TxId object with the provided hexadecimal value.
     *
     * @param {HexUInt32} hexUInt32 - The hexadecimal value representing the TxId.
     */
    protected constructor(hexUInt32: HexUInt32) {
        super(Hex.POSITIVE, hexUInt32.digits);
    }
    /**
     * Creates a new TxId object from the given expression.
     *
     * @param {bigint | number | string | HexInt | Uint8Array} exp - The expression to create the TxId from.
     *     It can be one of the following types:
     *     - bigint: A BigInteger value that represents the TxId.
     *     - number: A number value that represents the TxId.
     *     - string: A string value that represents the TxId.
     *     - HexInt: A HexInt object that represents the TxId.
     *     - Uint8Array: A Uint8Array object that represents the TxId.
     *
     * @returns {TxId} - A new TxId object created from the given expression.
     *
     * @throws {InvalidDataType} If the given expression is not a valid hexadecimal positive integer expression.
     */
    public static of(
        exp: bigint | number | string | Uint8Array | HexInt
    ): TxId {
        try {
            if (exp instanceof HexUInt32) {
                return new TxId(exp);
            }
            return new TxId(HexUInt32.of(exp));
        } catch (e) {
            throw new InvalidDataType(
                'TxId.of',
                'not a TxId expression',
                { exp: `${exp}` }, // Needed to serialize bigint values.
                e
            );
        }
    }
}

export { TxId };
