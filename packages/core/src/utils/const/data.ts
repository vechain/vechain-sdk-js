/**
 * Create a Uint8Array filled with zero bytes of the specified size.
 *
 * @param {number} size - The size of the Uint8Array to create.
 * @returns {Uint8Array} - A Uint8Array filled with zero bytes.
 */
const ZERO_BYTES = (size: number): Uint8Array => new Uint8Array(size);

/**
 * Regular expression for matching numeric values expressed as base 10 strings.
 *
 * The regular expression matches the following numeric patterns:
 *    - Whole numbers:
 *      - Positive whole numbers: 1, 2, 3, ...
 *      - Negative whole numbers: -1, -2, -3, ...
 *    - Decimal numbers:
 *      - Positive decimal numbers: 1.0, 2.5, 3.14, ...
 *      - Negative decimal numbers: -1.0, -2.5, -3.14, ...
 *      - Decimal numbers without whole part:
 *        - Positive decimal numbers: .1, .5, .75, ...
 *        - Negative decimal numbers: -.1, -.5, -.75, ...
 *
 * @constant {RegExp} NUMERIC_REGEX
 */
const NUMERIC_REGEX = /(^-?\d+(\.\d+)?)$|(^-?\.\d+)$/;

export { NUMERIC_REGEX, ZERO_BYTES };
