import { VTHO } from './currency/VTHO';
import { Units } from './currency/Units';
import { UInt } from './UInt';
import { IllegalArgumentError } from '../errors';

/**
 * Full Qualified Path
 */
const FQP = 'packages/core/src/vcdm/Gas.ts!';

/**
 * Represents a Gas class for handling gas values within the system.
 * This class is derived from UInt and encapsulates gas-specific operations.
 */
class Gas extends UInt {
    protected constructor(value: number) {
        super(value);
    }

    /**
     * Creates a new instance of Gas with the given exponent.
     * The exponent must be a non-negative integer.
     *
     * @param {number} exp - The exponent value to create a Gas instance.
     * @return {Gas} A new Gas instance with the specified exponent.
     * @throws {IllegalArgumentError} If the provided exponent is not a non-negative integer.
     */
    static of(exp: number): Gas {
        if (exp >= 0 && Number.isInteger(exp)) {
            return new Gas(exp);
        }
        throw new IllegalArgumentError(
            `${FQP}Gas.of(exp: number): Gas`,
            'not an unsigned integer expression',
            {
                exp: `${exp}`
            }
        );
    }

    /**
     *
     * @returns The value of this Gas object as a VTHO.
     * 10^5 gas = 1 VTHO
     * 1 gas = 10^13 weiVTHO
     */
    toVTHO(): VTHO {
        return VTHO.of(this.valueOf() ** Math.pow(10, 13), Units.wei);
    }
}

export { Gas };
