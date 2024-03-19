import { assert, DATA } from '@vechain/sdk-errors';
import { Buffer } from 'buffer';
import { type HexString } from 'ethers/lib.esm/utils/data';

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
 * @see {H0x.of}
 */
const PREFIX: string = '0x';

/**
 * The radix value used for hexadecimal numbers.
 *
 * @type {number}
 */
const RADIX: number = 16;

/**
 * Regular expression for matching a string in the format /^0x[0-9A-Fa-f]*$/
 *
 * @type {RegExp}
 * @see HexString
 */
const REGEX_FOR_0X_EXP = /^0x[0-9A-Fa-f]*$/;

/**
 * Represents the error messages used in the {@link Hex} object.
 * @enum {string}
 */
enum ErrorMessage {
    /**
     * Error message constant for invalid hexadecimal expression
     * not matching {@link REGEX_FOR_0X_EXP}.
     *
     * @const {string}
     */
    NOT_HEX = `Arg 'n' not an hexadecimal expression`,
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
 * Represents a value that can be represented in hexadecimal format.
 *
 * @typedef {bigint | Buffer | Uint8Array | number | string} HexRepresentable
 */
type HexRepresentable = bigint | Buffer | Uint8Array | number | string;

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
        'Hex.ts.ofBigInt',
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
 * Convert a Buffer to a padded hexadecimal representation long the specified number of bytes.
 *
 * @param {Buffer} buffer - The Uint8Array to be represented as hexadecimal string.
 * @param {number} [bytes=0] - The number of bytes the resulting hexadecimal representation should be padded to.
 * @return {string} - The padded hexadecimal representation of the buffer.
 */
function ofBuffer(buffer: Buffer, bytes: number = 0): string {
    return pad(buffer.toString(ENCODING), bytes);
}

/**
 * Converts a hexadecimal string representing a number to a padded lowercase hexadecimal string.
 *
 * @param {HexString} n - The hexadecimal string representing the number.
 * @param {number} [bytes=0] - The number of bytes the resulting hexadecimal string should be padded to. Defaults to 0.
 * @returns {string} - The padded lowercase hexadecimal string.
 */
function ofHexString(n: HexString, bytes: number = 0): string {
    assert(
        'Hex.ts.ofHexString',
        H0x.isValid(n),
        DATA.INVALID_DATA_TYPE,
        ErrorMessage.NOT_HEX,
        { n }
    );
    return pad(n.slice(2).toLowerCase(), bytes);
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
        'Hex.ts.ofNumber',
        Number.isInteger(n),
        DATA.INVALID_DATA_TYPE,
        ErrorMessage.NOT_INTEGER,
        {
            n
        }
    );
    assert(
        'Hex.ts.ofNumber',
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
 * Converts a string to its binary representation,
 * then to its padded hexadecimal representation
 * long the specified number of bytes.
 *
 * @param {string} txt - The input string to be converted.
 * @param {number} bytes - The number of bytes the resulting hexadecimal representation should be padded to.
 * @returns {string} - The padded hexadecimal representation of the number.
 * @see {ofBuffer}
 */
function ofString(txt: string, bytes: number): string {
    return ofBuffer(Buffer.from(txt), bytes);
}

/**
 * Convert an Uint8Array to a padded hexadecimal representation long the specified number of bytes.
 *
 * @param {Uint8Array} uint8Array - The Uint8Array to be represented as hexadecimal string.
 * @param {number} [bytes=0] - The number of bytes the resulting hexadecimal representation should be padded to.
 * @return {string} - The padded hexadecimal representation of the buffer.
 * @see {ofBuffer}
 */
function ofUint8Array(uint8Array: Uint8Array, bytes: number = 0): string {
    return ofBuffer(Buffer.from(uint8Array), bytes);
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
 * Trims leading zeros from a string.
 *
 * @param {string} exp - The string to trim.
 * @returns {string} - The trimmed string.
 * @see Quantity.of
 */
function trim(exp: string): string {
    let i = 0;
    while (i < exp.length && exp.at(i) === '0') {
        i++;
    }
    return i === exp.length ? '0' : exp.slice(i);
}

/**
 * Helper class for encoding hexadecimal values prefixed with '0x'.
 */
const H0x = {
    /**
     * Checks if the given expression is a valid hexadecimal expression
     * prefixed with `0x`.
     *
     * @param {string} exp - The expression to be validated.
     * @returns {boolean} - Whether the expression is valid or not.
     */
    isValid(exp: string): boolean {
        return REGEX_FOR_0X_EXP.test(exp);
    },
    /**
     * Returns a hexadecimal representation from the given input data prefixed with `0x`.
     *
     * **Note:** this method calls {@link Hex.of} to generate the hexadecimal representation of n,
     * then it prefixes the result with `0x`.
     *
     * @param {HexRepresentable} n - The input data to be represented.
     * @param {number} [bytes=0] - If not `0` by default, the hexadecimal representation encodes at least {number}  bytes.
     * @returns {Uint8Array} - The resulting hexadecimal representation,
     * it is guaranteed to be even characters long.
     * @see Hex
     * @see HexRepresentable
     */
    of: function (n: HexRepresentable, bytes: number = 0): string {
        return `${PREFIX}${Hex.of(n, bytes)}`;
    }
};

/**
 * Helper class for encoding hexadecimal values.
 */
const Hex = {
    /**
     * Returns a hexadecimal representation from the given input data.
     * This method calls
     * * {@link ofBigInt} if `n` type is `bigint`;
     * * {@link ofBuffer} if `n` is an instance of {@link Buffer};
     * * {@link ofHexString} if `n` type is {@link HexString}`;
     * * {@link ofNumber} if `n` type is `number`;
     * * {@link ofString} if `n` type is `string`;
     * * {@link ofUint8Array} if `n` is an instance of {@link Uint8Array}.
     *
     * **Note:** the returned string is not prefixed with `0x`,
     * see {@link H0x.of} to make a hexadecimal representation prefixed with `0x`.
     *
     * **Note:** [HexString](https://docs.ethers.org/v6/api/utils/#HexString)
     * definition overlaps `string` TS completely as an alias.
     * This function tests if the given input starts with `0x`
     * and is positive to {@link H0x.isValid}
     * processing it as {@link HexString} type,
     * else it considers the string as an array of bytes and
     * returns its hexadecimal representation.
     * To force a string to be considered an array of bytes despite it is
     * a valid `0x` hexadecimal expression, convert it to {@link Buffer}.
     * ```
     * Hex.of(buffer.toString('hex'))
     * ```
     *
     * @param {HexRepresentable} n - The input data to be represented.
     * @param {number} [bytes=0] - If not `0` by default, the hexadecimal representation encodes at least {number}  bytes.
     * @returns {Uint8Array} - The resulting hexadecimal representation,
     * it is guaranteed to be even characters long.
     * @see HexRepresentable
     */
    of: function (n: HexRepresentable, bytes: number = 0): string {
        if (n instanceof Buffer) return ofBuffer(n, bytes);
        if (n instanceof Uint8Array) return ofUint8Array(n, bytes);
        if (typeof n === 'bigint') return ofBigInt(n, bytes);
        if (typeof n === 'number') return ofNumber(n, bytes);
        if (H0x.isValid(n)) return ofHexString(n, bytes);
        return ofString(n, bytes);
    }
};

const Quantity = {
    /**
     *  Returns a hexadecimal representation for the given input data
     *  - without any not meaningful `0` digit on the left side,
     *  - prefixed with `0x`,
     *  - hence returns `0x0` if `n` is zero.
     *
     * This function is a more efficient drop-in replacement of the function
     * `toQuantity` in [math.ts](https://github.com/ethers-io/ethers.js/blob/main/src.ts/utils/maths.ts)
     * of [The Ethers Project](https://github.com/ethers-io/ethers.js/tree/main) library.
     *
     * @param {HexRepresentable} n - The input data to be represented.
     * @return The resulting hexadecimal representation, nibble aligned.
     * @see HexRepresentable
     */
    of(n: HexRepresentable): string {
        return `${PREFIX}${trim(Hex.of(n))}`;
    }
};

export { Hex, H0x, Quantity };
