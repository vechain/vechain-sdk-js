import { assert, DATA } from '@vechain/sdk-errors';
import { Buffer } from 'buffer';

/**
 * The encoding used for buffers.
 *
 * @type {BufferEncoding}
 * @constant
 * @see {ofString}
 */
const ENCODING: BufferEncoding = 'hex' as BufferEncoding;

/**
 * The PREFIX constant represents the prefix string used in the code.
 * The prefix is set to '0x', indicating that the following value is in hexadecimal format.
 *
 * @constant {string}
 * @default '0x'
 * @see {Hex.of0x}
 */
const PREFIX: string = '0x';

/**
 * The radix value used for hexadecimal numbers.
 *
 * @type {number}
 */
const RADIX: number = 16;

/**
 * Represents the error messages used in the {@link Hex} object.
 * @enum {string}
 */
enum ErrorMessage {
    /**
     * String constant representing an error message when the argument 'n' is not an integer.
     *
     * @type {string}
     * @see {ofNumber}
     */
    NOT_INTEGER = `Arg 'n' not an integer.`,

    /**
     * String constant representing an error message when argument 'n' is not negative.
     *
     * @type {string}
     * @see {ofBigInt}
     * @see {ofNumber}
     */
    NOT_POSITIVE = `Arg 'n' not negative.`
}

/**
 * Convert a bigint number to a padded hexadecimal representation long the specified number of bytes.
 *
 * @param {bigint} bi - The bigint number to be represented as hexadecimal string.
 * @param {number} bytes - The number of bytes the resulting hexadecimal representation should be padded to.
 * @returns {string} - The padded hexadecimal representation of the bigint number.
 * @throws {ErrorMessage} - If n is negative.
 */
function ofBigInt(bi: bigint, bytes: number): string {
    assert(
        'Hex.ofBigInt',
        bi >= 0,
        DATA.INVALID_DATA_TYPE,
        ErrorMessage.NOT_POSITIVE,
        {
            bi: bi.toString()
        }
    );
    return pad(bi.toString(RADIX), bytes);
}

/**
 * Convert an Uint8Array to a padded hexadecimal representation long the specified number of bytes.
 *
 * @param {Uint8Array} buffer - The Uint8Array to be represented as hexadecimal string.
 * @param {number} [bytes=0] - The number of bytes the resulting hexadecimal representation should be padded to.
 * @return {string} - The padded hexadecimal representation of the buffer.
 */
function ofBuffer(buffer: Buffer | Uint8Array, bytes: number = 0): string {
    return pad(Buffer.from(buffer).toString(ENCODING), bytes);
}

/**
 * Convert a number to a padded hexadecimal representation long the specified number of bytes.
 *
 * @param {number} n - The number to be represented as hexadecimal string.
 * @param {number} bytes - The number of bytes the resulting hexadecimal representation should be padded to.
 * @returns {string} The padded hexadecimal representation of the number.
 * @throws Throws an error if the provided number is not an integer or is not positive.
 */
function ofNumber(n: number, bytes: number): string {
    assert(
        'Hex.ofNumber',
        Number.isInteger(n),
        DATA.INVALID_DATA_TYPE,
        ErrorMessage.NOT_INTEGER,
        {
            n
        }
    );
    assert(
        'Hex.ofNumber',
        n >= 0,
        DATA.INVALID_DATA_TYPE,
        ErrorMessage.NOT_POSITIVE,
        {
            n
        }
    );
    return pad(n.toString(RADIX), bytes);
}

/**
 * Converts a string to its padded hexadecimal representation long the specified number of bytes.
 *
 * @param {string} txt - The input string to be converted.
 * @param {number} bytes - The number of bytes the resulting hexadecimal representation should be padded to.
 * @returns {string} - The padded hexadecimal representation of the number.
 */
function ofString(txt: string, bytes: number): string {
    return pad(Buffer.from(txt).toString(ENCODING), bytes);
}

/**
 * Adds padding to a hexadecimal expression to ensure it represents the specified number of bytes.
 *
 * @param {string} exp - The hexadecimal expression to pad.
 * @param {number} bytes - The number of bytes that the expression should occupy.
 *
 * @return {string} The padded hexadecimal expression.
 */
function pad(exp: string, bytes: number): string {
    if (exp.length % 2 !== 0) {
        exp = '0' + exp;
    }
    if (bytes > 0) {
        const gap = bytes - exp.length / 2;
        if (gap > 0) {
            return `${'00'.repeat(gap)}${exp}`;
        }
    }
    return exp;
}

/**
 * Helper class for encoding hexadecimal values.
 */
const Hex = {
    /**
     * Generate a hexadecimal representation from the given input data.
     * This method calls
     * * {@link ofBigInt} if `n` type is `bigint`;
     * * {@link ofNumber} if `n` type is `number`;
     * * {@link ofString} if `n` type is `string`;
     * * {@link ofBuffer} if `n` is an instance of {@link Uint8Array}.
     *
     * **Note:** the returned string is not prefixed with `0x`,
     * see {@link Hex.of0x} to make a hexadecimal representation prefixed with `0x`.
     *
     * @param {bigint | Uint8Array | number | string} n - The input data to be represented.
     * @param {number} [bytes=0] - If not `0` by default, the hexadecimal representation encodes at least {number}  bytes.
     * @returns {Uint8Array} - The resulting hexadecimal representation,
     * it is guaranteed to be even characters long.
     */
    of: function (
        n: bigint | number | string | Uint8Array,
        bytes: number = 0
    ): string {
        if (typeof n === 'bigint') return ofBigInt(n, bytes);
        if (typeof n === 'number') return ofNumber(n, bytes);
        if (typeof n === 'string') return ofString(n, bytes);
        return ofBuffer(n, bytes);
    },

    /**
     * Generate a hexadecimal representation from the given input data prefixed with `0x`.
     *
     * **Note:** this method calls {@link Hex.of} to generate the hexadecimal representation of n,
     * then it prefixes the result with `0x`.
     *
     * @param {bigint | Uint8Array | number | string} n - The input data to be represented.
     * @param {number} [bytes=0] - If not `0` by default, the hexadecimal representation encodes at least {number}  bytes.
     * @returns {Uint8Array} - The resulting hexadecimal representation,
     * it is guaranteed to be even characters long.
     */
    of0x: function (
        n: bigint | Uint8Array | number | string,
        bytes: number = 0
    ): string {
        return `${PREFIX}${this.of(n, bytes)}`;
    }
};

export { Hex, ofBuffer };
