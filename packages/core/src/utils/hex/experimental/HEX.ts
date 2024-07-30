import * as nc_utils from '@noble/curves/abstract/utils';
import * as nh_utils from '@noble/hashes/utils';
import { InvalidDataType } from '@vechain/sdk-errors';
import { BigNumber } from 'bignumber.js';
import { type Comparable } from '../../../experimental';
import { TXT } from '../../txt/experimental/TXT';

/**
 * Class representing a hexadecimal value.
 * @class
 */
class HEX extends String implements Comparable<HEX> {
    /**
     * The radix variable represents the base used for representing integers as strings.
     *
     * @type {number}
     * @constant
     * @default 16
     */
    protected static readonly RADIX: number = 16;

    /**
     * Regular expression pattern used to validate a hexadecimal value.
     *
     * @type {RegExp}
     */
    private static readonly REGEX_HEX: RegExp = /^(0x)?[0-9a-f]*$/i;

    /**
     * Regular expression pattern used to match strings starting with "0x" in a case-insensitive manner.
     *
     * @type {RegExp}
     */
    protected static readonly REGEX_PREFIX: RegExp = /^0x/i;

    /**
     * Represents a hexadecimal value, normalized lower-case, no prefix.
     *
     * @typedef {string} Hex
     */
    public readonly hex: string;

    /**
     * HEX Constructor.
     *
     * @param {string} hex - The hexadecimal expression.
     * @param {function} normalize - The normalization function to convert the hexadecimal expression to a normalized
     *                              form. Defaults to converting the expression to lowercase.
     * @returns {void}
     * @throws {InvalidDataType} if `hex` is not a valid hexadecimal expression.
     */
    public constructor(
        hex: string,
        normalize: (hex: string) => string = (exp) => exp.toLowerCase()
    ) {
        let value = hex;
        if (HEX.REGEX_PREFIX.test(value)) {
            value = value.slice(2);
        }
        if (HEX.isValid(value)) {
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
     * Compares this HEX object with the specified HEX object.
     *
     * @param {HEX} that - The HEX object to compare with.
     * @returns {number} - A negative integer if this HEX is less than the specified HEX,
     *                    zero if they are equal, or a positive integer if this HEX is greater
     *                    than the specified HEX.
     */
    public compareTo(that: HEX): number {
        const thisBytes = this.bytes;
        const thatBytes = that.bytes;
        const compareLength = thisBytes.length - thatBytes.length;
        if (compareLength === 0) {
            let i = 0;
            let compareByte = 0;
            while (compareByte === 0 && i < thisBytes.length) {
                compareByte = thisBytes[i] - thatBytes[i];
                i++;
            }
            return compareByte;
        }
        return compareLength;
    }

    /**
     * Determines if the current HEX object is equal to the given HEX object.
     *
     * @param {HEX} that - The HEX object to compare with.
     * @return {boolean} - True if the objects are equal, otherwise false.
     */
    public isEqual(that: HEX): boolean {
        return this.compareTo(that) === 0;
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
        return HEX.REGEX_HEX.test(exp);
    }

    /**
     * Returns a hexadecimal representation of the provided value.
     *
     * @param {bigint | number | string | Uint8Array} value - The value to convert to a hexadecimal representation.
     * Strings are NFC normalized and encoded as array of bytes. To represent hexadecimal literals use the class constructor.
     * @param {number} [bytesLength=1] - The number of bytes to pad the resulting hexadecimal representation with. Default is 1.
     * @returns {HEX} - The hexadecimal representation of the provided value.
     * @throws {InvalidDataType} - If the given value is negative number.
     */
    public static of(
        value: bigint | number | string | Uint8Array,
        bytesLength: number = 1
    ): HEX {
        if (value instanceof Uint8Array)
            return HEX.ofBytes(value).pad(bytesLength);
        if (typeof value === 'bigint')
            return HEX.ofBigInt(value).pad(bytesLength);
        if (typeof value === 'number')
            return HEX.ofNumber(value).pad(bytesLength);
        return HEX.ofText(value).pad(bytesLength);
    }

    /**
     * Creates a new HEX instance from a given bigint value.
     *
     * @param {bigint} bi - The bigint value to convert to HEX.
     * @private
     * @returns {HEX} - The new HEX instance.
     * @throws {InvalidDataType} - If the given bigint value is negative.
     */
    private static ofBigInt(bi: bigint): HEX {
        if (bi >= 0n) {
            return new HEX(bi.toString(HEX.RADIX));
        }
        throw new InvalidDataType(
            'Hex.ofBigInt',
            'negative value is not an hexadecimal expression',
            { bi: bi.toString() }
        );
    }

    /**
     * Converts an array of bytes to a hexadecimal string representation.
     *
     * @param {Uint8Array} bytes - The array of bytes to convert.
     * @returns {HEX} - The hexadecimal string representation.
     * @private
     */
    private static ofBytes(bytes: Uint8Array): HEX {
        return new HEX(nc_utils.bytesToHex(bytes));
    }

    /**
     * Converts a number to an unpadded hexadecimal expression.
     *
     * @param {number} n - The number to convert.
     * @private
     * @returns {HEX} - The hexadecimal representation of the number.
     * @throws {InvalidDataType} - If the given number value is negative.
     */
    private static ofNumber(n: number): HEX {
        if (n >= 0n) {
            return new HEX(nc_utils.numberToHexUnpadded(n));
        }
        throw new InvalidDataType(
            'Hex.ofBigInt',
            'negative value is not an hexadecimal expression',
            { n }
        );
    }

    /**
     * Converts a given text string into a HEX object.
     * The method normalizes the text in {@link NFC} form and encodes it as an array of bytes.
     *
     * @param {string} txt - The text string to convert.
     * @private
     * @returns {HEX} - The HEX object representing the converted text string.
     */
    private static ofText(txt: string): HEX {
        return this.ofBytes(new TXT(txt).bytes);
    }

    /**
     * Generates a random HEX value.
     *
     * @param {number} [bytesLength] - The length of the random bytes. If not provided, a default length will be used.
     *
     * @return {HEX} - A random HEX value.
     */
    public static random(bytesLength?: number): HEX {
        return this.ofBytes(nh_utils.randomBytes(bytesLength));
    }

    /**
     * Return the BigInt value of this hexadecimal representation.
     *
     * @returns {bigint} - The BigInt value of this hexadecimal representation.
     */
    public get bi(): bigint {
        return nc_utils.hexToNumber(this.hex);
    }

    /**
     * Returns the BigNumber value of this hexadecimal representation.
     *
     * @return {BigNumber} The BigNumber value of this hexadecimal representation.
     */
    public get bn(): BigNumber {
        return BigNumber(this.bi.toString());
    }

    /**
     * Returns the array of bytes of this hexadecimal representation.
     *
     * @returns {Uint8Array} The array of bytes of this hexadecimal representation.
     */
    public get bytes(): Uint8Array {
        return nc_utils.hexToBytes(this.hex);
    }

    /**
     * Returns the number value of this hexadecimal representation.
     *
     * @returns {number} - The number value of this hexadecimal representation.
     */
    public get n(): number {
        return this.bn.toNumber();
    }

    /**
     * Pads the HEX value with leading zeros to reach the specified length in bytes.
     *
     * @param {number} bytesLength - The desired length in bytes.
     * @returns {HEX} - A new instance of HEX with the specified padding.
     */
    public pad(bytesLength: number): HEX {
        let hex = this.hex;
        if (bytesLength > 0) {
            if (hex.length % 2 !== 0) {
                hex = '0' + hex;
            }
            const gap = bytesLength - hex.length / 2;
            if (gap > 0) {
                hex = '00'.repeat(gap) + hex;
            }
        }
        return new HEX(hex);
    }

    /**
     * Returns a new Quant object expressing the value of this hexadecimal representation.
     *
     * @return {Quant} The Quant object.
     */
    public get quant(): Quant {
        return new Quant(this.hex);
    }

    /**
     * Retrieves the decoded text from the bytes using the HEX decoder.
     *
     * @returns A {@link TXT} string representing the decoded text.
     */
    public get text(): string {
        return TXT.of(this).toString();
    }
}

/**
 * Represents a VeChain Thor quantity value in hexadecimal format,
 * no meaningful most significant zero digit are represented.
 *
 * @extends HEX
 */
class Quant extends HEX {
    /**
     * Creates a new instance, the internal {@link hex} representation trims
     * any not meaningful most significant zero digit.
     *
     * @param {string} hex - The hex value to be passed to the constructor.
     */
    constructor(hex: string) {
        super(
            Quant.zeroLeftTrim(HEX.REGEX_PREFIX.test(hex) ? hex.slice(2) : hex)
        );
    }

    /**
     * Creates a new `Quant` object from a given value.
     *
     * @param {bigint | number | string | Uint8Array} value - The value to create the `Quant` object from.
     *
     * @return {Quant} A new `Quant` object created from the given `value`.
     */
    public static of(value: bigint | number | string | Uint8Array): Quant {
        return new Quant(HEX.of(value, 0).hex);
    }

    /**
     * Trims leading zeros from a hexadecimal string.
     *
     * @param {string} hex - The hexadecimal string to trim.
     * @protected
     * @returns {string} - The trimmed hexadecimal string.
     */
    private static zeroLeftTrim(hex: string): string {
        let i = 0;
        while (i < hex.length && hex.at(i) === '0') {
            i++;
        }
        return i === hex.length ? '0' : hex.slice(i);
    }
}

export { HEX, Quant };
