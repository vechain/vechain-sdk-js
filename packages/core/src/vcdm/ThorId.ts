import { Hex } from './Hex';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Represents a ThorId.
 * @experiemntal
 */
class ThorId extends Hex {
    /**
     * Number of digits to represent a Thor ID value.
     *
     * @type {number}
     */
    private static readonly DIGITS = 64;

    /**
     * Constructs a ThorId object with the provided hexadecimal value.
     *
     * @param {Hex} hex - The hexadecimal value representing the ThorId.
     *
     * @throws {InvalidDataType} - If the provided value is not a valid ThorId expression.
     * @experiemntal
     */
    protected constructor(hex: Hex) {
        if (ThorId.isValid(hex.hex)) {
            super(Hex.POSITIVE, hex.hex);
        } else {
            throw new InvalidDataType(
                'ThorId.constructor',
                'not a ThorId expression',
                { hex }
            );
        }
    }

    /**
     * Check if the given expression is a valid ThorId.
     *
     * @param {string} exp - The expression to be validated.
     * @return {boolean} Returns true if the expression is a valid ThorId, false otherwise.
     * @experimental
     */
    public static isValid(exp: string): boolean {
        return Hex.isValid(exp) && Hex.REGEX_PREFIX.test(exp)
            ? exp.length === ThorId.DIGITS + 2
            : exp.length === ThorId.DIGITS;
    }

    /**
     * Determines whether the given string is a valid hex number prefixed with '0x'.
     *
     * @param {string} exp - The hex number to be checked.
     * @returns {boolean} - True if the hex number is valid, false otherwise.
     * @experimental
     */
    public static isValid0x(exp: string): boolean {
        return Hex.REGEX_PREFIX.test(exp) && ThorId.isValid(exp);
    }

    /**
     * Creates a new ThorId object from the given expression.
     *
     * @param {bigint | number | string | Hex | Uint8Array} exp - The expression to create the ThorId from.
     *     It can be one of the following types:
     *     - bigint: A BigInteger value that represents the ThorId.
     *     - number: A number value that represents the ThorId.
     *     - string: A string value that represents the ThorId.
     *     - Hex: A Hex object that represents the ThorId.
     *     - Uint8Array: A Uint8Array object that represents the ThorId.
     * @returns {ThorId} - A new ThorId object created from the given expression.
     * @experimntal
     */
    public static of(exp: bigint | number | string | Hex | Uint8Array): ThorId {
        if (exp instanceof Hex) {
            return new ThorId(exp.fit(this.DIGITS));
        }
        return new ThorId(Hex.of(exp).fit(ThorId.DIGITS));
    }
}

export { ThorId };
