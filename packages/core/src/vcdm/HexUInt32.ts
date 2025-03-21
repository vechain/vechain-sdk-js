import { HexUInt } from './HexUInt';
import { IllegalArgumentError } from '../errors';
import { type HexInt } from './HexInt';

/**
 * Full Qualified Path
 */
const FQP = 'packages/core/src/vcdm/HexUInt32.ts!';

/**
 * Represents a 32-byte hexadecimal unsigned integer.
 *
 * @extends HexUInt
 */
class HexUInt32 extends HexUInt {
    /**
     * Expected byte length.
     * @type {number}
     */
    private static readonly BYTE_LENGTH = 32;

    /**
     * Regular expression for matching 32 bytes hexadecimal strings.
     * An empty input is represented as a empty digits.
     *
     * @type {RegExp}
     */
    private static readonly REGEX_HEXUINT32: RegExp = /^(0x)?[0-9a-f]{64}$/i;

    /**
     * Checks if the given string expression is a valid 32 bytes unsigned hexadecimal value.
     *
     * @param {string} exp - The string representation of a hexadecimal value.
     *
     * @return {boolean} - True if the expression is a valid 32 bytes unsigned hexadecimal value, case-insensitive,
     * optionally prefixed with `0x`; false otherwise.
     */
    public static isValid(exp: string): boolean {
        return HexUInt32.REGEX_HEXUINT32.test(exp);
    }

    /**
     * Ensures the hexadecimal string representation is 32 bytes long.
     * @param {string} hexString - The hexadecimal string to validate.
     * @returns {string} The 32 bytes long hexadecimal string.
     */
    private static convertTo32Bytes(hexString: string): string {
        const nonPrefixedHex = hexString.replace(/^0x/, '');

        return nonPrefixedHex.padStart(this.BYTE_LENGTH * 2, '0');
    }

    /**
     * Creates a HexUInt32 instance with enforced 32 bytes length.
     * @param {bigint | number | string | Uint8Array | HexInt} exp - The expression to convert.
     * @returns {HexUInt32} The HexUInt32 object representing the given expression.
     * @throws {IllegalArgumentError} If the value is not a valid 32-byte hex string.
     */
    public static of(
        exp: bigint | number | string | Uint8Array | HexInt
    ): HexUInt32 {
        try {
            const hexUInt = HexUInt.of(exp);

            const hexDigits = this.convertTo32Bytes(hexUInt.toString());

            return new HexUInt32(hexUInt.sign, hexDigits);
        } catch (e) {
            throw new IllegalArgumentError(
                `${FQP}HexUInt32.of(exp: bigint | number | string | Uint8Array | HexInt): HexUInt32`,
                'not a 32 bytes long hexadecimal positive integer expression',
                { exp: `${exp}`, e },
                e instanceof Error ? e : undefined
            );
        }
    }
}

export { HexUInt32 };
