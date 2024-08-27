import { HexUInt } from './HexUInt';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Represents a hexadecimal numeric value compatible with the result of
 * [ethers](https://docs.ethers.org/v6/)
 * [utils.toQuantity](https://docs.ethers.org/v6/api/utils/#toQuantity) function.
 * This is most commonly used for JSON-RPC numeric values.
 *
 * @remarks A quantity instance:
 * * has not empty content,
 * * the hexadecimal representation removes any not meaningful zero on the left side of the expression,
 * * represents only positive integers.
 *
 * @extends HexUInt
 */
class Quantity extends HexUInt {
    /**
     * Creates a Quantity instance from a bigint or number given expression
     *
     * @param {bigint | number} exp - The value to be expressed as Quantity object:
     * * bigint must be positive;
     * * number must be positive, it is converted to bigint to create the Quantity.
     *
     * @returns {Quantity} - The new Quantity object.
     *
     * @throws {InvalidDataType} - If the provided expression is not a positive integer value.
     */
    public static of(exp: bigint | number): Quantity {
        try {
            const huint = HexUInt.of(exp);
            let cue = 0;
            while (cue < huint.digits.length && huint.digits.at(cue) === '0') {
                cue++;
            }
            return new Quantity(
                huint.sign,
                cue === huint.digits.length ? '0' : huint.digits.slice(cue)
            );
        } catch (e) {
            throw new InvalidDataType(
                'Quantity.of',
                'not a Quantity expression',
                { exp: `${exp}` }, // Needed to serialize bigint values.
                e
            );
        }
    }
}

export { Quantity };
