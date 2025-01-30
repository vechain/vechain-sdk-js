import { InvalidDataType } from '@vechain/sdk-errors';
import { type HexInt } from './HexInt';
import { HexUInt } from './HexUInt';

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
     * @throws {InvalidDataType} If the value is not a valid 32-byte hex string.
     */
    public static of(
        exp: bigint | number | string | Uint8Array | HexInt
    ): HexUInt32 {
        try {
            const hexUInt = HexUInt.of(exp);

            const hexDigits = this.convertTo32Bytes(hexUInt.toString());

            return new HexUInt32(hexUInt.sign, hexDigits);
        } catch (e) {
            throw new InvalidDataType(
                'HexUInt32.of',
                'not a 32 bytes long hexadecimal positive integer expression',
                { exp: `${exp}`, e },
                e
            );
        }
    }
}

export { HexUInt32 };
