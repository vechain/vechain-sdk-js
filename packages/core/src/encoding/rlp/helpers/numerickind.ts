import { dataUtils } from '../../../utils';
import { type RLPInput } from '../types';
import { createRlpError } from './profiles';

/**
 * Validates and converts the input data to a BigInt.
 *
 * @param data - Either a number or a string representing a non-negative integer.
 * @param context - A string representing the context in which this function is used,
 *                 to create meaningful error messages.
 * @returns The input data converted to a BigInt.
 * @throws Will throw an error if the data is invalid (not a number or non-negative integer string).
 */
const validateNumericKindData = (data: RLPInput, context: string): bigint => {
    if (typeof data === 'number') {
        _validateNumericKindNumber(data, context);
    } else if (typeof data === 'string') {
        _validateNumericKindString(data, context);
    } else {
        throw createRlpError(context, 'expected string or number');
    }

    return BigInt(data);
};

/**
 * Ensures that a numeric input is a safe and non-negative integer.
 *
 * @remarks
 * A "safe integer" in JavaScript is an integer that can be precisely represented
 * without rounding in the double-precision floating point format used by the language,
 * i.e., between 0 and 2^53 - 1, since we're ensuring non-negativity.
 *
 * @param num - The number to be validated.
 * @param context - A string indicating the context, used for error messaging.
 * @throws Will throw an error if the number is not a non-negative safe integer.
 */
const _validateNumericKindNumber = (num: number, context: string): void => {
    if (!Number.isSafeInteger(num) || num < 0) {
        throw createRlpError(context, 'expected non-negative safe integer');
    }
};

/**
 * Validates a string to ensure it represents a valid non-negative integer.
 *
 * @remarks
 * The input string can represent an integer in either decimal or hexadecimal format.
 *
 * @param str - A string expected to represent a non-negative integer.
 * @param context - A string indicating the context, for creating meaningful error messages.
 * @throws Will throw an error if the string does not represent a valid non-negative integer.
 *
 * @private
 */
const _validateNumericKindString = (str: string, context: string): void => {
    const isHex = dataUtils.isHexString(str);
    const isDecimal = dataUtils.isDecimalString(str);

    if (!isHex && !isDecimal) {
        throw createRlpError(
            context,
            'expected non-negative integer in hex or dec string'
        );
    }

    // Ensure hex numbers are of a valid length.
    if (isHex && str.length <= 2) {
        throw createRlpError(context, 'expected valid hex string number');
    }
};

/**
 * Validates a buffer to ensure it adheres to constraints and doesn’t contain
 * leading zero bytes which are not canonical representation in integers.
 *
 * @param buf - The buffer to validate.
 * @param context - A string providing context for error messages.
 * @param maxBytes - [Optional] An integer representing the maximum allowed length
 *                   of the buffer. If provided, an error will be thrown if buf is longer.
 * @throws Will throw an error if the buffer does not adhere to the constraints.
 *
 * @private
 */
const assertValidNumericKindBuffer = (
    buf: Buffer,
    context: string,
    maxBytes?: number
): void => {
    // If maxBytes is defined, ensure buffer length is within bounds.
    if (maxBytes !== undefined && buf.length > maxBytes) {
        throw createRlpError(context, `expected less than ${maxBytes} bytes`);
    }

    // Ensure the buffer does not have leading zeros, as it's not canonical in integer representation.
    if (buf[0] === 0) {
        throw createRlpError(
            context,
            'expected canonical integer (no leading zero bytes)'
        );
    }
};

/**
 * Encode a BigInt instance into a Buffer, ensuring it adheres to specific constraints.
 * @param bi - BigInt instance to encode.
 * @param maxBytes - Maximum byte length allowed for the encoding. If undefined, no byte size limit is imposed.
 * @param context - Contextual information for error messages.
 * @returns A Buffer instance containing the encoded data.
 * @throws Will throw an error if the encoded data exceeds the defined `maxBytes`.
 */
const encodeBigIntToBuffer = (
    bi: bigint,
    maxBytes: number | undefined,
    context: string
): Buffer => {
    if (bi === 0n) return Buffer.alloc(0);

    let hex = bi.toString(16);

    // Ensure hex string has an even length
    if (hex.length % 2 !== 0) {
        hex = '0' + hex;
    }

    if (maxBytes !== undefined && hex.length > maxBytes * 2) {
        throw createRlpError(context, `expected number in ${maxBytes} bytes`);
    }

    return Buffer.from(hex, 'hex');
};

/**
 * Decode a Buffer into a number or hexadecimal string.
 * @param buffer - Buffer instance to decode.
 * @returns A number if the decoded BigInt is a safe integer, otherwise returns a hexadecimal string.
 */
const decodeBufferToNumberOrHex = (buffer: Buffer): number | string => {
    if (buffer.length === 0) return 0;

    const bi = BigInt('0x' + buffer.toString('hex'));
    const num = Number(bi);

    // Return number or hex based on integer safety
    return Number.isSafeInteger(num) ? num : '0x' + bi.toString(16);
};

export {
    validateNumericKindData,
    assertValidNumericKindBuffer,
    encodeBigIntToBuffer,
    decodeBufferToNumberOrHex
};
