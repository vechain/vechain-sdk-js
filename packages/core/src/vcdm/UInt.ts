import { Int } from '@vcdm';
import { IllegalArgumentError } from '@errors';

/**
 * Full Qualified Path
 */
const FQP = 'packages/core/src/vcdm/UInt.ts!';

/**
 * Represents an unsigned integer, extending the `Int` class.
 * Encapsulates only non-negative integer values.
 * The `UInt` class is primarily intended for cases where unsigned integer operations are required.
 * Instances of this class can only be created through the static `of` method.
 *
 * The constructor is protected to prevent direct instantiation; use the `of` method instead.
 */
class UInt extends Int {
    /**
     * Protected constructor for creating an instance with a specified numeric value.
     *
     * @param {number} value - The numeric value to initialize the instance.
     * @return {void} Does not return a value.
     */
    protected constructor(value: number) {
        super(value);
    }

    /**
     * Creates a new instance of UInt using the provided exponent value.
     *
     * @param {number} exp - The exponent value to initialize the UInt instance. Must be a non-negative integer.
     * @return {UInt} A new instance of the UInt class initialized with the given exponent if it is a valid non-negative integer.
     * @throws {IllegalArgumentError} If the provided exponent is not a non-negative integer.
     */
    static of(exp: number): UInt {
        if (exp >= 0 && Number.isInteger(exp)) {
            return new UInt(exp);
        }
        throw new IllegalArgumentError(
            `${FQP}UInt.of(exp: number): UInt`,
            'not an unsigned integer expression',
            {
                exp: `${exp}`
            }
        );
    }
}

export { UInt };
