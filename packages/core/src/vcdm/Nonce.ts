import { Hex, HexUInt } from '@vcdm';
import { IllegalArgumentError } from '@errors';

/**
 * Full Qualified Path
 */
const FQP = 'packages/core/src/vcdm/Nonce.ts!';

/**
 * The Nonce class represents a hexadecimal unsigned integer with a fixed number of digits.
 * It extends the HexUInt class to provide specific constraints and validation for nonces.
 * This class is immutable and ensures the value adheres to the specified digit requirements.
 */
class Nonce extends HexUInt {
    /**
     * Represents the total number of digits to be used or processed.
     * This value is typically a constant and denotes the fixed length or size
     * associated with numeric data or a specific operation that requires
     * numeric handling with this number of digits.
     *
     * @type {number}
     * @constant
     */
    private static readonly DIGITS = 8;

    /**
     * Protected constructor for initializing a Nonce object with a given HexUInt instance.
     *
     * @param {HexUInt} huint - The HexUInt instance used to construct the Nonce. This value will be processed
     *                          to fit the required digits and determine the Nonce's properties.
     */
    protected constructor(huint: HexUInt) {
        super(Hex.POSITIVE, huint.fit(Nonce.DIGITS).digits);
    }

    /**
     * Determines if the provided string meets the criteria for validity.
     *
     * @param {string} exp - The string to validate.
     * @return {boolean} Returns true if the string is valid based on the specified rules, otherwise false.
     */
    public static isValid(exp: string): boolean {
        return Hex.isValid(exp) && HexUInt.REGEX_HEXUINT_PREFIX.test(exp)
            ? exp.length === Nonce.DIGITS + 2
            : exp.length === Nonce.DIGITS;
    }

    /**
     * Determines if the given string is a valid hexadecimal value prefixed with "0x".
     *
     * @param {string} exp - The string expression to check for validity.
     * @return {boolean} Returns true if the input string is prefixed with "0x" and valid, otherwise false.
     */
    public static isValid0x(exp: string): boolean {
        return HexUInt.REGEX_HEXUINT_PREFIX.test(exp) && Nonce.isValid(exp);
    }

    /**
     * Converts the given input into a `Nonce` object. The input can be of type `bigint`, `number`,
     * `string`, `Uint8Array`, or `HexUInt`. If the input is already a `HexUInt`, it will directly
     * create a `Nonce`. Otherwise, the input will be converted to a `HexUInt` before creating the `Nonce`.
     * Throws an `IllegalArgumentError` if the input is not a valid `Nonce` expression.
     *
     * @param {bigint|number|string|Uint8Array|HexUInt} exp - The input value to be converted to a `Nonce`.
     * @return {Nonce} - A new `Nonce` object created from the input.
     * @throws {IllegalArgumentError} - If the input is not a valid `Nonce` expression.
     */
    public static of(
        exp: bigint | number | string | Uint8Array | HexUInt
    ): Nonce {
        try {
            if (exp instanceof HexUInt) {
                return new Nonce(exp);
            }
            return new Nonce(HexUInt.of(exp));
        } catch (e) {
            throw new IllegalArgumentError(
                `${FQP}Nonce.of( exp: bigint | number | string | Uint8Array | HexUInt): Nonce`,
                'not a Nonce expression',
                { exp: `${exp}` }, // Needed to serialize bigint values.
                e instanceof Error ? e : undefined
            );
        }
    }
}

export { Nonce };
