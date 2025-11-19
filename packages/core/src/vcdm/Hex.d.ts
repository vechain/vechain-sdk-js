import { type VeChainDataModel } from './VeChainDataModel';
/**
 * Represents a hexadecimal value expressed as
 * * `-` sign if the value is negative,
 * * `0x` hexadecimal notation tag,
 * * a not empty string of hexadecimal digits from `0` to `9` and from `a` to `f`.
 *
 * @description This hexadecimal notation is coherent with the decimal notation:
 * * the sign is only expressed for negative values, and it is always the first symbol,
 * * the `0x` tags the string as a hexadecimal expression,
 * * hexadecimal digits follow.
 * * An empty content results is no digits.
 *
 * @implements {VeChainDataModel<Hex>}
 */
declare class Hex implements VeChainDataModel<Hex> {
    /**
     * Negative multiplier of the {@link digits} absolute value.
     *
     * @type {number}
     */
    protected static readonly NEGATIVE: number;
    /**
     * Positive multiplier of the {@link digits} absolute value.
     *
     * @type {number}
     */
    protected static readonly POSITIVE: number;
    /**
     * A constant string prefix used in hexadecimal notation.
     */
    static readonly PREFIX = "0x";
    /**
     * The radix used for representing numbers base 16 in a positional numeral notation system.
     *
     * @typedef {number} RADIX
     */
    static readonly RADIX: number;
    /**
     * Regular expression for matching hexadecimal strings.
     * An empty input is represented as a empty digits.
     *
     * @type {RegExp}
     */
    private static readonly REGEX_HEX;
    /**
     * Regular expression pattern to match a prefix indicating hexadecimal number.
     *
     * @type {RegExp}
     */
    protected static readonly REGEX_HEX_PREFIX: RegExp;
    /**
     * Returns the hexadecimal digits expressing this absolute value, sign and `0x` prefix omitted.

     * @remarks An empty content results in an empty string returned.
     */
    readonly digits: string;
    /**
     * Represents the sign multiplier of a given number:
     * * {@link NEGATIVE} `-1` if negative,
     * * {@link POSITIVE} `1` if positive.
     */
    readonly sign: number;
    /**
     * Creates a new instance of this class to represent the value
     * built multiplying `sign` for the absolute value expressed by the hexadecimal `digits`.
     *
     * @param {number} sign - The sign of the value.
     * @param {string} digits - The digits of the absolute value in hexadecimal base.
     * @param {function} [normalize] - The function used to normalize the digits. Defaults to converting digits to lowercase.
     */
    protected constructor(sign: number, digits: string, normalize?: (digits: string) => string);
    /**
     * Returns the absolute value of this Hex object.
     *
     * @return {Hex} A new Hex object representing the absolute value of this Hex.
     */
    get abs(): Hex;
    /**
     * Returns the value of `bi` as a `BigInt` type.
     *
     * @returns {bigint} The value of `bi` as a `BigInt`.
     */
    get bi(): bigint;
    /**
     * Returns the Uint8Array representation of the aligned bytes.
     *
     * @return {Uint8Array} The Uint8Array representation of the aligned bytes.
     */
    get bytes(): Uint8Array;
    /**
     * Returns the value of n.
     *
     * @return {number} The value of n.
     *
     * @throws {InvalidOperation<Hex>} Throws an error if this instance doesn't represent
     * an [IEEE 754 double precision 64 bits floating point format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format).
     */
    get n(): number;
    /**
     * Aligns the hexadecimal string to bytes by adding a leading '0' if the string length is odd.
     *
     * @returns {Hex} - The aligned hexadecimal string.
     */
    alignToBytes(): Hex;
    /**
     * Compares the current Hex object with another Hex object.
     *
     * @param {Hex} that - The Hex object to compare with.
     *
     * @return {number} - Returns a negative number if the current Hex object is less than the given Hex object,
     *                    zero if they are equal, or a positive number if the current Hex object is greater than the given Hex object.
     */
    compareTo(that: Hex): number;
    /**
     * Returns a new instance of the Hex class, its value fits to the specified number of digits.
     *
     * @param {number} digits - The number of digits to fit the Hex value into.
     *
     * @returns {Hex} - A new Hex instance that represents the fitted Hex value.
     *
     * @throws {InvalidDataType} - If the Hex value cannot be fit into the specified number of digits.
     */
    fit(digits: number): Hex;
    /**
     * Determines whether this Hex instance is equal to the given Hex instance.
     *
     * @param {Hex} that - The Hex instance to compare with.
     * @return {boolean} - True if the Hex instances are equal, otherwise false.
     */
    isEqual(that: Hex): boolean;
    /**
     * Checks if this instance expresses a valid {@link Number} value
     * according the
     * [IEEE 754 double precision 64 bits floating point format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format).
     *
     * @returns {boolean} Returns true if this instance expresses 32 hex digits (16 bytes, 128 bits) needed to represent
     * a {@link Number} value, else it returns false.
     */
    isNumber(): boolean;
    /**
     * Checks if the given string expression is a valid hexadecimal value.
     *
     * @param {string} exp - The string representation of a hexadecimal value.
     *
     * @return {boolean} - True if the expression is a valid hexadecimal value, case-insensitive,
     * optionally prefixed with `0x`; false otherwise.
     */
    static isValid(exp: string): boolean;
    /**
     * Determines whether the given string is a valid hexadecimal number prefixed with '0x'.
     *
     * @param {string} exp - The string to be evaluated.
     * @return {boolean} - True if the string is a valid hexadecimal number prefixed with '0x', otherwise false.
     */
    static isValid0x(exp: string): boolean;
    /**
     * Create a Hex instance from a bigint, number, string, or Uint8Array.
     *
     * @param {bigint | number | string | Uint8Array} exp - The value to represent in a Hex instance:
     * * bigint is always representable in hexadecimal base notation;
     * * number, encoded as [IEEE 754 double precision 64 bits floating point format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format);
     * * string is parsed as the hexadecimal expression of a bigint value, optionally tagged with `0x`;
     * * Uint8Array is interpreted as the sequence of bytes.
     *
     * @returns {Hex} - A Hex instance representing the input value.
     *
     * @throws {InvalidDataType} if the given `exp` can't be represented as a hexadecimal expression.
     */
    static of(exp: bigint | number | string | Uint8Array): Hex;
    /**
     * Generates a random Hex value of the given number of bytes length.
     *
     * @param {number} bytes - The number of bytes to generate.
     * @throws {InvalidDataType} - If the bytes argument is not greater than 0.
     * @returns {Hex} - A randomly generated Hex value.
     *
     * @remarks Security auditable method, depends on
     * * [`nh_utils.randomBytes`](https://github.com/paulmillr/noble-hashes?tab=readme-ov-file#utils).
     */
    static random(bytes: number): Hex;
    /**
     * Returns a string representation of the object.
     *
     * @param {boolean} compact - Whether to compact the string representation.
     * @return {string} The string representation of the object.
     */
    toString(compact?: boolean): string;
}
export { Hex };
//# sourceMappingURL=Hex.d.ts.map