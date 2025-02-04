import { Hex } from './Hex';
import { type HexInt } from './HexInt';
import { HexUInt32 } from './HexUInt32';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * The StorageKey class represents the location or key used to store data in the contract's persistent storage which is a hexadecimal positive integer having 64 digits.
 *
 * @extends HexUInt32
 */
class StorageKey extends HexUInt32 {
    /**
     * Constructs a StorageKey object with the provided hexadecimal value.
     *
     * @param {HexUInt32} hexUInt32 - The hexadecimal value representing the StorageKey.
     */
    protected constructor(hexUInt32: HexUInt32) {
        super(Hex.POSITIVE, hexUInt32.digits);
    }
    /**
     * Creates a new StorageKey object from the given expression.
     *
     * @param {bigint | number | string | HexInt | Uint8Array} exp - The expression to create the StorageKey from.
     *     It can be one of the following types:
     *     - bigint: A BigInteger value that represents the StorageKey.
     *     - number: A number value that represents the StorageKey.
     *     - string: A string value that represents the StorageKey.
     *     - HexInt: A HexInt object that represents the StorageKey.
     *     - Uint8Array: A Uint8Array object that represents the StorageKey.
     *
     * @returns {StorageKey} - A new StorageKey object created from the given expression.
     *
     * @throws {InvalidDataType} If the given expression is not a valid hexadecimal positive integer expression.
     */
    public static of(
        exp: bigint | number | string | Uint8Array | HexInt
    ): StorageKey {
        try {
            if (exp instanceof HexUInt32) {
                return new StorageKey(exp);
            }
            return new StorageKey(HexUInt32.of(exp));
        } catch (e) {
            throw new InvalidDataType(
                'StorageKey.of',
                'not a StorageKey expression',
                { exp: `${exp}` }, // Needed to serialize bigint values.
                e
            );
        }
    }
}

export { StorageKey };
