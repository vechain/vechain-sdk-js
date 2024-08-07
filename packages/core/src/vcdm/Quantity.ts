import * as nc_utils from '@noble/curves/abstract/utils';
import { Hex } from './Hex';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * A class representing a quantity in hexadecimal format.
 * @extends Hex
 * @experimental
 */
class Quantity extends Hex {
    /**
     * Constructs a new Quantity object with the given hexadecimal expression.
     *
     * @param {string} exp - The hexadecimal expression to use.
     * @protected
     */
    protected constructor(exp: string) {
        let value = exp;
        if (Hex.REGEX_PREFIX.test(value)) {
            value = value.slice(2);
        }
        if (Hex.isValid(value)) {
            let cue = 0;
            while (cue < value.length && value.at(cue) === '0') {
                cue++;
            }
            if (cue === value.length) {
                super('0');
            } else {
                super(value.slice(cue));
            }
        } else {
            throw new InvalidDataType(
                'Quantity.constructor',
                'not an hexadecimal expression',
                { value }
            );
        }
    }

    /**
     * Creates a new Quantity object from the given input.
     *
     * @param {bigint | number | string | Hex | Uint8Array} exp - The input value to create Quantity from.
     * @returns {Quantity} A new Quantity object.
     * @experimental
     */
    public static of(
        exp: bigint | number | string | Hex | Uint8Array
    ): Quantity {
        if (exp instanceof Hex) {
            return new Quantity(exp.hex);
        }
        if (exp instanceof Uint8Array) {
            return new Quantity(nc_utils.bytesToHex(exp));
        } else if (typeof exp === 'bigint') {
            return new Quantity(nc_utils.numberToHexUnpadded(exp));
        } else if (typeof exp === 'number') {
            return new Quantity(nc_utils.numberToHexUnpadded(exp));
        }
        return new Hex(exp);
    }
}

export { Quantity };
