import * as nh_utils from '@noble/hashes/utils';
import * as nc_utils from '@noble/curves/abstract/utils';
import { InvalidCastType, InvalidDataType } from '@vechain/sdk-errors';
import { type VeChainDataModel } from './VeChainDataModel';

/**
 * Represents a hexadecimal value.
 * @implements {VeChainDataModel<Hex>}
 */
class Hex extends String implements VeChainDataModel<Hex> {
    /**
     * The radix used for representing numbers base 16 in a positional numeral notation system.
     *
     * @typedef {number} RADIX
     */
    protected static readonly RADIX: number = 16;

    private static readonly REGEX_HEX: RegExp = /^(0x)?[0-9a-f]*$/i;

    protected static readonly REGEX_PREFIX: RegExp = /^0x/i;

    public readonly hex: string;

    /**
     * Creates a new instance of this class representing the `exp` hexadecimal expression.
     *
     * @param {string} exp - The hexadecimal expression.
     * @param {function} normalize - A function used to normalize the hexadecimal expression. Defaults to converting it to lowercase.
     *
     * @throws {InvalidDataType} - Thrown when the exp parameter is not a valid hexadecimal expression.
     */
    protected constructor(
        exp: string,
        normalize: (exp: string) => string = (exp) => exp.toLowerCase()
    ) {
        let value = exp;
        if (Hex.REGEX_PREFIX.test(value)) {
            value = value.slice(2);
        }
        if (Hex.isValid(value)) {
            value = normalize(value);
            super('0x' + value);
            this.hex = value;
        } else {
            throw new InvalidDataType(
                'Hex.constructor',
                'not an hexadecimal expression',
                { value }
            );
        }
    }

    /**
     * Returns the value of `bi` as a `BigInt` type.
     *
     * @returns {bigint} The value of `bi` as a `BigInt`.
     */
    get bi(): bigint {
        return nc_utils.hexToNumber(this.hex);
    }

    /**
     * Returns the Uint8Array representation of the aligned bytes.
     *
     * @return {Uint8Array} The Uint8Array representation of the aligned bytes.
     */
    get bytes(): Uint8Array {
        return nc_utils.hexToBytes(this.alignToBytes().hex);
    }

    /**
     * Retrieves the value of n.
     *
     * @return {number} The value of n.
     * @throws {InvalidCastType<Hex>} Throws an error if this instance doesn't represent
     * an [IEEE 754 double precision 64 bits floating point format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format).
     */
    get n(): number {
        if (this.isNumber()) {
            return new DataView(this.bytes.buffer).getFloat64(0);
        }
        throw new InvalidCastType<Hex>(
            'Hex.n',
            'not an IEEE 754 float 64 number',
            this
        );
    }

    /**
     * Aligns the hexadecimal string to bytes by adding a leading '0' if the string length is odd.
     *
     * @returns {Hex} - The aligned hexadecimal string.
     */
    public alignToBytes(): Hex {
        return this.hex.length % 2 === 0 ? this : new Hex('0' + this.hex);
    }

    /**
     * Compares the current Hex object with another Hex object.
     *
     * @param {Hex} that - The Hex object to compare with.
     * @return {number} - Returns a negative number if the current Hex object is less than the given Hex object,
     *                    zero if they are equal, or a positive number if the current Hex object is greater than the given Hex object.
     */
    compareTo(that: Hex): number {
        const digits = Math.max(this.hex.length, that.hex.length);
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
        if (digits < this.hex.length) {
            // Cut.
            let cue = 0;
            while (this.hex.length - cue > digits && this.hex.at(cue) === '0') {
                cue++;
            }
            if (this.hex.length - cue === digits) {
                return new Hex(this.hex.slice(cue));
            }
            throw new InvalidDataType(
                'Hex.fit',
                `can't fit in ${digits} digits`,
                { digits, hex: this }
            );
        }
        if (digits > this.hex.length) {
            // Pad.
            return new Hex('0'.repeat(digits - this.hex.length) + this.hex);
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
        return this.hex.length === 32;
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
        return Hex.REGEX_PREFIX.test(exp) && Hex.isValid(exp);
    }

    /**
     * Create a Hex instance from a bigint, number, string, or Uint8Array.
     *
     * @param {bigint | number | string | Uint8Array} exp - The input value to convert to a Hex instance:
     * * bigint encoded as hexadecimal expression of the bytes representing its absolute value;
     * * number encoded as [IEEE 754 double precision 64 bits floating point format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format);
     * * string parsed as a hexadecimal expression, optionally prefixed with `0x`;
     * * Uint8Array encoded as hexadecimal expression of the bytes represented in the provided expression;
     * @returns {Hex} - A Hex instance representing the input value.
     */
    public static of(exp: bigint | number | string | Uint8Array): Hex {
        try {
            if (exp instanceof Uint8Array) {
                return new Hex(nc_utils.bytesToHex(exp));
            } else if (typeof exp === 'bigint') {
                return new Hex(nc_utils.numberToHexUnpadded(exp));
            } else if (typeof exp === 'number') {
                const dataView = new DataView(new ArrayBuffer(16));
                dataView.setFloat64(0, exp);
                return Hex.of(new Uint8Array(dataView.buffer));
            }
            return new Hex(exp);
        } catch (e) {
            throw new InvalidDataType(
                'Hex.of',
                'not an hexadecimal expression',
                { exp },
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
     * @remark Security auditable method, depends on
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
}

export { Hex };
