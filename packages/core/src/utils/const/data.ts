import { Buffer } from 'buffer';

/**
 * Zero Buffer
 * @internal
 *
 * @example ZERO_BUFFER(8) -> 0x00000000 , ... , ZERO_BUFFER(n) -> 0x0...0
 */
const ZERO_BUFFER = (size: number): Buffer => Buffer.from(ZERO_BYTES(size));

/**
 * Create a Uint8Array filled with zero bytes of the specified size.
 *
 * @param {number} size - The size of the Uint8Array to create.
 * @returns {Uint8Array} - A Uint8Array filled with zero bytes.
 */
const ZERO_BYTES = (size: number): Uint8Array => new Uint8Array(size);

/**
 * Regular expression for validating base 10 integer number format strings.
 */
const DECIMAL_INTEGER_REGEX = /^\d+$/;

/**
 * Regular expression for validating base 10 numeric number format strings.
 * Allows optional "-" prefix and validates both integer and floating point numbers.
 * Also allows for numbers with no leading digits (i.e. ".123", which is equivalent to "0.123").
 */
const NUMERIC_REGEX = /(^-?\d+(\.\d+)?)$|(^-?\.\d+)$/;

export { ZERO_BUFFER, ZERO_BYTES, DECIMAL_INTEGER_REGEX, NUMERIC_REGEX };
