import * as nc_utils from '@noble/curves/abstract/utils';
import * as nh_utils from '@noble/hashes/utils';
import { assert, DATA } from '@vechain/sdk-errors';
import { BigNumber } from 'bignumber.js';
import { type Comparable } from '../../../experimental';

/**
 * Class representing a hexadecimal value.
 * @class
 */
class HEX implements Comparable<HEX> {
    /**
     * Represents a decoder for text used to normalize and decode texts in array of bytes expressed in hexadecimal form.
     *
     * @class
     * @see {text}
     */
    private static readonly DECODER = new TextDecoder();

    /**
     * Represents an encoder for text used to normalize and encode texts in array of bytes expressed in hexadecimal form.
     *
     * @class
     * @see {ofText}
     */
    private static readonly ENCODER = new TextEncoder();

    /**
     * The [Unicode Equivalence](https://en.wikipedia.org/wiki/Unicode_equivalence)
     * Canonical Composition normalization form used for Unicode strings.
     *
     * @type {string}
     * @constant
     * @description
     * The normalization form determines how Unicode characters are composed or decomposed.
     * The value 'NFC' stands for Normalization Form Canonical Composition,
     * which composes pre-composed characters and
     * decomposes compatibility characters.
     *
     * @see {ofText}
     */
    private static readonly NORMALIZATION_FORM = 'NFC';

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
     * Hex constructor
     *
     * @param {string} hex - The hexadecimal value to be assigned to the hex property,
     * optionally prefixed with `0x` case-insensitive.
     *
     * @return {void}
     * @throws {InvalidDataTypeError} if `hex` is not a valid hexadecimal expression.
     */
    public constructor(
        hex: string,
        normalize: (hex: string) => string = (exp) => exp.toLowerCase()
    ) {
        let val = hex;
        if (HEX.REGEX_PREFIX.test(val)) {
            val = val.slice(2);
        }
        assert(
            'Hex.constructor',
            HEX.isValid(val),
            DATA.INVALID_DATA_TYPE,
            'not an hexadecimal expression',
            { val }
        );
        this.hex = normalize(val);
    }

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
     * @throws {InvalidDataTypeError} - If the given value is negative number.
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
     * @throws {InvalidDataTypeError} - If the given bigint value is negative.
     */
    private static ofBigInt(bi: bigint): HEX {
        assert(
            'Hex.ofBigInt',
            bi >= 0n,
            DATA.INVALID_DATA_TYPE,
            'negative value is not an hexadecimal expression',
            { bi: bi.toString() }
        );
        return new HEX(bi.toString(HEX.RADIX));
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
     * @throws {InvalidDataTypeError} - If the given number value is negative.
     */
    private static ofNumber(n: number): HEX {
        assert(
            'Hex.ofBigInt',
            n >= 0n,
            DATA.INVALID_DATA_TYPE,
            'negative value is not an hexadecimal expression',
            { n }
        );
        return new HEX(nc_utils.numberToHexUnpadded(n));
    }

    /**
     * Converts a given text string into a HEX object.
     * The method normalizes the text in {@link NORMALIZATION_FORM} form and encodes it as an array of bytes.
     *
     * @param {string} txt - The text string to convert.
     * @private
     * @returns {HEX} - The HEX object representing the converted text string.
     */
    private static ofText(txt: string): HEX {
        return this.ofBytes(
            HEX.ENCODER.encode(txt.normalize(HEX.NORMALIZATION_FORM))
        );
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
     * Returns the array of bytes of this hexadecimal representation.
     *
     * @returns {Uint8Array} The array of bytes of this hexadecimal representation.
     */
    public get bytes(): Uint8Array {
        return nc_utils.hexToBytes(this.hex);
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
     * Retrieves the decoded text from the bytes using the HEX decoder.
     *
     * @returns A string representing the decoded text.
     */
    public get text(): string {
        return HEX.DECODER.decode(this.bytes);
    }

    /**
     * Returns a string representation of the object.
     * The returned string includes the hexadecimal value of the object.
     *
     * @return {string} The string representation of the object.
     */
    public toString(): string {
        return '0x' + this.hex;
    }

    /**
     * Trims leading and trailing whitespace from a HEX value.
     *
     * @return {HEX} - A new HEX object with the trimmed value.
     */
    public trim(): Quant {
        return new Quant(this.hex);
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
        super(Quant.trim(HEX.REGEX_PREFIX.test(hex) ? hex.slice(2) : hex));
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
    private static trim(hex: string): string {
        let i = 0;
        while (i < hex.length && hex.at(i) === '0') {
            i++;
        }
        return i === hex.length ? '0' : hex.slice(i);
    }
}

export { HEX, Quant };
