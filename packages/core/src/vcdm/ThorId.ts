import { Hex } from './Hex';
import { HexUInt } from './HexUInt';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * The ThorId class represents a Thor ID value, which is a hexadecimal positive integer having 64 digits.
 *
 * @extends HexInt
 */
class ThorId extends HexUInt {
    /**
     * Number of digits to represent a Thor ID value.
     *
     * @remarks The `0x` prefix is excluded.
     *
     * @type {number}
     */
    private static readonly DIGITS = 64;

    /**
     * Constructs a ThorId object with the provided hexadecimal value.
     *
     * @param {HexUInt} huint - The hexadecimal value representing the ThorId.
     */
    protected constructor(huint: HexUInt) {
        super(Hex.POSITIVE, huint.fit(ThorId.DIGITS).digits);
    }

    /**
     * Check if the given expression is a valid ThorId.
     *
     * @param {string} exp - The expression to be validated.
     *
     * @return {boolean} Returns true if the expression is a valid ThorId, false otherwise.
     */
    public static isValid(exp: string): boolean {
        return Hex.isValid(exp) && HexUInt.REGEX_HEXUINT_PREFIX.test(exp)
            ? exp.length === ThorId.DIGITS + 2
            : exp.length === ThorId.DIGITS;
    }

    /**
     * Determines whether the given string is a valid hex number prefixed with '0x'.
     *
     * @param {string} exp - The hex number to be checked.
     *
     *  @returns {boolean} - True if the hex number is valid, false otherwise.
     */
    public static isValid0x(exp: string): boolean {
        return HexUInt.REGEX_HEXUINT_PREFIX.test(exp) && ThorId.isValid(exp);
    }

    /**
     * Creates a new ThorId object from the given expression.
     *
     * @param {bigint | number | string | Hex | Uint8Array} exp - The expression to create the ThorId from.
     *     It can be one of the following types:
     *     - bigint: A BigInteger value that represents the ThorId.
     *     - number: A number value that represents the ThorId.
     *     - string: A string value that represents the ThorId.
     *     - HexUInt: A HexUInt object that represents the ThorId.
     *     - Uint8Array: A Uint8Array object that represents the ThorId.
     *
     * @returns {ThorId} - A new ThorId object created from the given expression.
     *
     * @throws {InvalidDataType} If the given expression is not a valid hexadecimal positive integer expression.
     */
    public static of(
        exp: bigint | number | string | Uint8Array | HexUInt
    ): ThorId {
        try {
            if (exp instanceof HexUInt) {
                return new ThorId(exp);
            }
            return new ThorId(HexUInt.of(exp));
        } catch (e) {
            throw new InvalidDataType(
                'ThorId.of',
                'not a ThorId expression',
                { exp: `${exp}` }, // Needed to serialize bigint values.
                e
            );
        }
    }
}

export { ThorId };
