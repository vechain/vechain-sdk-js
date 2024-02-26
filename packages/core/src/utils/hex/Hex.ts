import { assert, DATA } from '@vechain/vechain-sdk-errors/dist/index';
import { Buffer } from 'buffer';

// TODO: investigate vechain_sdk_core_ethers.toQuantity

/**
 * Represents the error messages used in the {@link Hex} object.
 * @enum {string}
 */
enum Error {
    /**
     * String constant representing an error message when the argument 'n' is not an integer.
     *
     * @type {string}
     * @see {Hex.ofNumber}
     */
    NOT_INTEGER = `Arg 'n' not an integer.`,

    /**
     * String constant representing an error message when argument 'n' is not negative.
     *
     * @type {string}
     * @see {Hex.ofBigInt}
     * @see {Hex.ofNumber}
     */
    NOT_POSITIVE = `Arg 'n' not negative.`
}

/**
 * Helper class for encoding hexadecimal values.
 */
export const Hex = {
    /**
     * The encoding used for buffers.
     *
     * @type {BufferEncoding}
     * @constant
     * @see {Hex.ofString}
     */
    ENCODING: 'hex' as BufferEncoding,
    /**
     * The PREFIX constant represents the prefix string used in the code.
     * The prefix is set to '0x', indicating that the following value is in hexadecimal format.
     *
     * @constant {string}
     * @default '0x'
     * @see {Hex.of0x}
     */
    PREFIX: '0x' as string,
    /**
     * The radix value used for hexadecimal numbers.
     *
     * @type {number}
     */
    RADIX: 16 as number,

    /**
     * Generate a hexadecimal representation from the given input data.
     * This method calls
     * * {@link Hex.ofBigInt} if `n` type is `bigint`;
     * * {@link Hex.ofNumber} if `n` type is `number`;
     * * {@link Hex.ofBuffer} if `n` is an instance of {@link Uint8Array};
     * * {@link Hex.ofString} if `n` type is `string`.
     *
     * **Note:** the returned string is not prefixed with `0x`,
     * see {@link Hex.of0x} to make a hexadecimal representation prefixed with `0x`.
     *
     * @param {bigint | Uint8Array | number | string} n - The input data to be represented.
     * @param {number} [bytes=0] - If not `0` by default, the hexadecimal representation encodes at least {number}  bytes.
     * @returns {Uint8Array} - The resulting hexadecimal representation,
     * it is guaranteed to be even characters long.
     */
    of: function (n: bigint | Uint8Array | number | string, bytes: number = 0) {
        if (typeof n === 'bigint') return this.ofBigInt(n, bytes);
        if (typeof n === 'number') return this.ofNumber(n, bytes);
        if (isBuffer(n)) return this.ofBuffer(n, bytes);
        return this.ofString(n, bytes);
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
    ) {
        return `${Hex.PREFIX}${this.of(n, bytes)}`;
    },

    /**
     * Convert a bigint number to a padded hexadecimal representation long the specified number of bytes.
     *
     * @param {bigint} n - The bigint number to be represented as hexadecimal string.
     * @param {number} bytes - The number of bytes the resulting hexadecimal representation should be padded to.
     * @returns {string} - The padded hexadecimal representation of the bigint number.
     * @throws {Error} - If n is negative.
     */
    ofBigInt: function (n: bigint, bytes: number): string {
        assert(n >= 0, DATA.INVALID_DATA_TYPE, Error.NOT_POSITIVE, {
            n
        });
        return pad(n.toString(this.RADIX), bytes);
    },

    /**
     * Convert an Uint8Array to a padded hexadecimal representation long the specified number of bytes.
     *
     * @param {Uint8Array} n - The Uint8Array to be represented as hexadecimal string.
     * @param {number} [bytes=0] - The number of bytes the resulting hexadecimal representation should be padded to.
     * @return {string} - The padded hexadecimal representation of the buffer.
     */
    ofBuffer(n: Uint8Array, bytes: number = 0): string {
        return pad(Buffer.from(n).toString(this.ENCODING), bytes);
    },

    /**
     * Convert a number to a padded hexadecimal representation long the specified number of bytes.
     *
     * @param {number} n - The number to be represented as hexadecimal string.
     * @param {number} bytes - The number of bytes the resulting hexadecimal representation should be padded to.
     * @returns {string} The padded hexadecimal representation of the number.
     * @throws Throws an error if the provided number is not an integer or is not positive.
     */
    ofNumber: function (n: number, bytes: number): string {
        assert(Number.isInteger(n), DATA.INVALID_DATA_TYPE, Error.NOT_INTEGER, {
            n
        });
        assert(n >= 0, DATA.INVALID_DATA_TYPE, Error.NOT_POSITIVE, {
            n
        });
        return pad(n.toString(this.RADIX), bytes);
    },

    /**
     * Converts a string to its padded hexadecimal representation long the specified number of bytes.
     *
     * @param {string} n - The input string to be converted.
     * @param {number} bytes - The number of bytes the resulting hexadecimal representation should be padded to.
     * @returns {string} - The padded hexadecimal representation of the number.
     */
    ofString: function (n: string, bytes: number): string {
        return pad(Buffer.from(n).toString(this.ENCODING), bytes);
    }
};

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
 * Checks if the given value is a buffer.
 *
 * @param {unknown} n - The value to check.
 * @return {boolean} - Returns true if the value is a buffer, otherwise returns false.
 */
function isBuffer(n: unknown): n is Uint8Array {
    return true;
}
