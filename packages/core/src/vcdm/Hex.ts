import * as nc_utils from '@noble/curves/abstract/utils';
import * as nh_utils from '@noble/hashes/utils';
import {
    InvalidOperation,
    InvalidDataType,
    type ObjectErrorData
} from '@vechain/sdk-errors';
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
class Hex implements VeChainDataModel<Hex> {
    /**
     * Negative multiplier of the {@link digits} absolute value.
     *
     * @type {number}
     */
    protected static readonly NEGATIVE: number = -1;

    /**
     * Positive multiplier of the {@link digits} absolute value.
     *
     * @type {number}
     */
    protected static readonly POSITIVE: number = 1;

    /**
     * The radix used for representing numbers base 16 in a positional numeral notation system.
     *
     * @typedef {number} RADIX
     */
    protected static readonly RADIX: number = 16;

    /**
     * Regular expression for matching hexadecimal strings.
     * An empty input is represented as a empty digits.
     *
     * @type {RegExp}
     */
    private static readonly REGEX_HEX: RegExp = /^-?(0x)?[0-9a-f]*$/i;

    /**
     * Regular expression pattern to match a prefix indicating hexadecimal number.
     *
     * @type {RegExp}
     */
    protected static readonly REGEX_HEX_PREFIX: RegExp = /^-?0x/i;

    /**
     * Returns the hexadecimal digits expressing this absolute value, sign and `0x` prefix omitted.

     * @remarks An empty content results in an empty string returned.
     */
    public readonly digits: string;

    /**
     * Represents the sign multiplier of a given number:
     * * {@link NEGATIVE} `-1` if negative,
     * * {@link POSITIVE} `1` if positive.
     */
    public readonly sign: number;

    /**
     * Creates a new instance of this class to represent the value
     * built multiplying `sign` for the absolute value expressed by the hexadecimal `digits`.
     *
     * @param {number} sign - The sign of the value.
     * @param {string} digits - The digits of the absolute value in hexadecimal base.
     * @param {function} [normalize] - The function used to normalize the digits. Defaults to converting digits to lowercase.
     */
    protected constructor(
        sign: number,
        digits: string,
        normalize: (digits: string) => string = (digits) => digits.toLowerCase()
    ) {
        this.digits = normalize(digits);
        this.sign = sign;
    }

    /**
     * Returns the absolute value of this Hex object.
     *
     * @return {Hex} A new Hex object representing the absolute value of this Hex.
     */
    public get abs(): Hex {
        return new Hex(Hex.POSITIVE, this.digits);
    }

    /**
     * Returns the value of `bi` as a `BigInt` type.
     *
     * @returns {bigint} The value of `bi` as a `BigInt`.
     */
    get bi(): bigint {
        return BigInt(this.sign) * nc_utils.hexToNumber(this.digits);
    }

    /**
     * Returns the Uint8Array representation of the aligned bytes.
     *
     * @return {Uint8Array} The Uint8Array representation of the aligned bytes.
     */
    get bytes(): Uint8Array {
        return nc_utils.hexToBytes(this.alignToBytes().digits);
    }

    /**
     * Returns the value of n.
     *
     * @return {number} The value of n.
     *
     * @throws {InvalidOperation<Hex>} Throws an error if this instance doesn't represent
     * an [IEEE 754 double precision 64 bits floating point format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format).
     */
    get n(): number {
        if (this.isNumber()) {
            // The sign is part of the IEEE 754 representation hence no need to consider `this.sign` property.
            return new DataView(this.bytes.buffer).getFloat64(0);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        throw new InvalidOperation('Hex.n', 'not an IEEE 754 float 64 number', {
            hex: this.toString()
        });
    }

    /**
     * Aligns the hexadecimal string to bytes by adding a leading '0' if the string length is odd.
     *
     * @returns {Hex} - The aligned hexadecimal string.
     */
    public alignToBytes(): Hex {
        return this.digits.length % 2 === 0
            ? this
            : new Hex(this.sign, '0' + this.digits);
    }

    /**
     * Compares the current Hex object with another Hex object.
     *
     * @param {Hex} that - The Hex object to compare with.
     *
     * @return {number} - Returns a negative number if the current Hex object is less than the given Hex object,
     *                    zero if they are equal, or a positive number if the current Hex object is greater than the given Hex object.
     */
    compareTo(that: Hex): number {
        if (this.sign === that.sign) {
            const digits = Math.max(this.digits.length, that.digits.length);
            const thisBytes = this.fit(digits).bytes;
            const thatBytes = that.fit(digits).bytes;
            let i = 0;
            let compareByte = 0;
            while (compareByte === 0 && i < thisBytes.length) {
                compareByte = thisBytes[i] - thatBytes[i];
                i++;
            }
            return compareByte;
        }
        return this.sign - that.sign;
    }

    /**
     * Returns a new instance of the Hex class, its value fits to the specified number of digits.
     *
     * @param {number} digits - The number of digits to fit the Hex value into.
     *
     * @returns {Hex} - A new Hex instance that represents the fitted Hex value.
     *
     * @throws {InvalidDataType} - If the Hex value cannot be fit into the specified number of digits.
     */
    public fit(digits: number): Hex {
        if (digits < this.digits.length) {
            // Cut.
            let cue = 0;
            while (
                this.digits.length - cue > digits &&
                this.digits.at(cue) === '0'
            ) {
                cue++;
            }
            if (this.digits.length - cue === digits) {
                return new Hex(this.sign, this.digits.slice(cue));
            }
            throw new InvalidDataType(
                'Hex.fit',
                `can't fit in ${digits} digits`,
                { digits, hex: this }
            );
        }
        if (digits > this.digits.length) {
            // Pad.
            return new Hex(
                this.sign,
                '0'.repeat(digits - this.digits.length) + this.digits
            );
        }
        return this;
    }

    /**
     * Determines whether this Hex instance is equal to the given Hex instance.
     *
     * @param {Hex} that - The Hex instance to compare with.
     * @return {boolean} - True if the Hex instances are equal, otherwise false.
     */
    isEqual(that: Hex): boolean {
        return this.compareTo(that) === 0;
    }

    /**
     * Checks if this instance expresses a valid {@link Number} value
     * according the
     * [IEEE 754 double precision 64 bits floating point format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format).
     *
     * @returns {boolean} Returns true if this instance expresses 32 hex digits (16 bytes, 128 bits) needed to represent
     * a {@link Number} value, else it returns false.
     */
    isNumber(): boolean {
        return this.digits.length === 32;
    }

    /**
     * Checks if the given string expression is a valid hexadecimal value.
     *
     * @param {string} exp - The string representation of a hexadecimal value.
     *
     * @return {boolean} - True if the expression is a valid hexadecimal value, case-insensitive,
     * optionally prefixed with `0x`; false otherwise.
     */
    public static isValid(exp: string): boolean {
        return Hex.REGEX_HEX.test(exp);
    }

    /**
     * Determines whether the given string is a valid hexadecimal number prefixed with '0x'.
     *
     * @param {string} exp - The string to be evaluated.
     * @return {boolean} - True if the string is a valid hexadecimal number prefixed with '0x', otherwise false.
     */
    public static isValid0x(exp: string): boolean {
        return Hex.REGEX_HEX_PREFIX.test(exp) && Hex.isValid(exp);
    }

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
    public static of(exp: bigint | number | string | Uint8Array): Hex {
        try {
            if (exp instanceof Uint8Array) {
                return new Hex(this.POSITIVE, nc_utils.bytesToHex(exp));
            } else if (typeof exp === 'bigint') {
                if (exp < 0n) {
                    return new Hex(
                        this.NEGATIVE,
                        nc_utils.numberToHexUnpadded(-1n * exp)
                    );
                }
                return new Hex(
                    this.POSITIVE,
                    nc_utils.numberToHexUnpadded(exp)
                );
            } else if (typeof exp === 'number') {
                const dataView = new DataView(new ArrayBuffer(16));
                dataView.setFloat64(0, exp);
                return new Hex(
                    exp < 0 ? this.NEGATIVE : this.POSITIVE,
                    nc_utils.bytesToHex(new Uint8Array(dataView.buffer))
                );
            }
            if (this.isValid(exp)) {
                if (exp.startsWith('-')) {
                    return new Hex(
                        this.NEGATIVE,
                        this.REGEX_HEX_PREFIX.test(exp)
                            ? exp.slice(3)
                            : exp.slice(1)
                    );
                }
                return new Hex(
                    this.POSITIVE,
                    this.REGEX_HEX_PREFIX.test(exp) ? exp.slice(2) : exp
                );
            }
            // noinspection ExceptionCaughtLocallyJS
            throw new InvalidDataType('Hex.of', 'not an hexadecimal string', {
                exp
            });
        } catch (e) {
            throw new InvalidDataType(
                'Hex.of',
                'not an hexadecimal expression',
                { exp: `${exp}` }, // Needed to serialize bigint values.
                e
            );
        }
    }

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
    public static random(bytes: number): Hex {
        if (bytes > 0) {
            return Hex.of(nh_utils.randomBytes(bytes));
        }
        throw new InvalidDataType('Hex.random', 'bytes argument not > 0', {
            bytes
        });
    }

    /**
     * Error handler for Hex and its subclasses so we do not hide them.
     * To be used only for nested errors.
     *
     * @param error - The error to handle from the subclass.
     * @param methodName - The name of the method that threw the error.
     * @param {string} errorMessage - The error message to throw.
     * @param {ObjectErrorData} data - The data to include in the error.
     * @throws {InvalidDataType} - Throws an error with the given message and data.
     */
    protected static throwInvalidDataType(
        error: unknown,
        methodName: string,
        errorMessage: string,
        data: ObjectErrorData
    ): never {
        if (error instanceof InvalidDataType) {
            throw error;
        }
        throw new InvalidDataType(methodName, errorMessage, data, error);
    }

    /**
     * Returns a string representation of the object.
     *
     * @return {string} The string representation of the object.
     */
    public toString(): string {
        return (this.sign < 0 ? '-0x' : '0x') + this.digits;
    }
}

export { Hex };
