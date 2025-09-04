import { IllegalArgumentError } from '@common/errors';

/**
 * Full Qualified Path
 */
const FQP = 'packages/sdk/src/vcdm/Int.ts!';

/**
 * The `Int` class is an extension of the native `Number` class, representing an integer value.
 * This class provides additional type safety and ensures that only integer values are instantiated.
 *
 * Instances of this class cannot be created directly. The `Int` class is designed to enforce
 * the use of its static factory method `of` for instance creation, which validates that the input
 * is an integer before returning an instance.
 *
 * Methods:
 * - `static of(exp: number): Int`
 *   Creates and returns an instance of the `Int` class if the input is a valid integer. Throws an
 *   error if the input is not an integer.
 */
class Int extends Number {
    /**
     * Protected constructor for initializing an instance with a specified numeric value.
     *
     * @param {number} value - The numeric value to initialize the instance with.
     * @return {void}
     */
    protected constructor(value: number) {
        super(value);
    }

    /**
     * Creates a new instance of the Int class from the given number if it is an integer.
     *
     * @param {number} exp The number to be converted into an Int instance.
     * @return {Int} A new instance of the Int class if the input is an integer.
     * @throws {IllegalArgumentError} Throws an error if the input is not an integer.
     */
    static of(exp: number): Int {
        if (Number.isInteger(exp)) {
            return new Int(exp);
        }
        throw new IllegalArgumentError(
            `${FQP}Int.of(exp: number): Int`,
            'not an integer expression',
            {
                exp: `${exp}`
            }
        );
    }
}

export { Int };
