/**
 * Zero buffer
 * @internal
 *
 * @example ZERO_BUFFER(8) -> 0x00000000 , ... , ZERO_BUFFER(n) -> 0x0...0
 */
const ZERO_BUFFER = (size: number): Buffer => Buffer.alloc(size, 0);

/**
 * Regular expression for validating hexadecimal addresses. Must have "0x" prefix. Must be 40 characters long.
 */
const HEX_ADDRESS_REGEX = /^0x[0-9a-f]{40}$/i;

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

export { ZERO_BUFFER, HEX_ADDRESS_REGEX, DECIMAL_INTEGER_REGEX, NUMERIC_REGEX };
