import * as n_utils from '@noble/curves/abstract/utils';
import { Hex } from '../../vcdm/Hex';
import { INTEGER_REGEX, NUMERIC_REGEX, ZERO_BYTES } from '../const';
import { Txt } from '../../vcdm';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Decodes a hexadecimal string representing a bytes32 value into a string.
 * The bytes32 string can be padded with zeros to the left or right.
 * An example of usage is to decode a bytes32 string returned by a smart contract function.
 *
 * @param {string} hex - The hexadecimal string to decode.
 * @returns {string} - The decoded string value.
 * @throws {InvalidDataType}
 */
const decodeBytes32String = (hex: string): string => {
    if (!Hex.isValid(hex) || Hex.of(hex).digits.length !== 64)
        throw new InvalidDataType(
            'dataUtils.decodeBytes32String()',
            `Failed to decode value ${hex} to string. Value is not a valid hex string or it is not 64 characters long`,
            { value: hex }
        );

    const valueInBytes = Hex.of(hex).bytes;
    // Find the first zero byte.
    const firstZeroIndex = valueInBytes.findIndex((byte) => byte === 0);
    // If the first byte is zero, then the encoded bytes 32 string is padded with zeros to the left.
    if (firstZeroIndex === 0) {
        // Find the first non-zero byte.
        const firstNotZeroIndex = valueInBytes.findIndex((byte) => byte !== 0);
        // Decode the encoded bytes 32 string to string by removing the padded zeros.
        return Txt.of(valueInBytes.subarray(firstNotZeroIndex)).toString();
    } else if (firstZeroIndex !== -1) {
        // Decode the encoded bytes 32 string to string by removing the padded zeros.
        return Txt.of(valueInBytes.subarray(0, firstZeroIndex)).toString();
    } else {
        return Txt.of(valueInBytes).toString();
    }
};

/**
 * Encodes a string into a bytes32 hexadecimal expression with optional zero padding.
 * The encoded bytes32 string can be used as a parameter for a smart contract function.
 *
 * @param {string} value - The value to encode.
 * @param {'left' | 'right'} [zeroPadding='left'] - The type of zero padding to apply.
 * @returns {string} The encoded bytes32 string is a hexadecimal expression prefixed with `0x.
 * @throws {InvalidDataType}
 */
const encodeBytes32String = (
    value: string,
    zeroPadding: 'left' | 'right' = 'right' // Default to 'right' as ethers.js does.
): string => {
    // Wrap any error raised by utf8BytesOf(value).
    try {
        const valueInBytes = Txt.of(value).bytes;

        if (valueInBytes.length > 32) {
            throw new InvalidDataType(
                'dataUtils.encodeBytes32String()',
                `Failed to encode value ${value} to bytes32 string. Value exceeds 32 bytes.`,
                { value }
            );
        }

        const pad = ZERO_BYTES(32 - valueInBytes.length);
        return zeroPadding === 'left'
            ? Hex.of(n_utils.concatBytes(pad, valueInBytes)).toString()
            : Hex.of(n_utils.concatBytes(valueInBytes, pad)).toString();
    } catch (e) {
        throw new InvalidDataType(
            'dataUtils.encodeBytes32String()',
            `Failed to encode value ${value} to bytes32 string.`,
            { value },
            e
        );
    }
};

/**
 * Checks whether the given string is a decimal number.
 *
 * @param {string} data - The string to be checked.
 * @returns {boolean} - True if the string represents a decimal number, false otherwise.
 *
 * @see {@link INTEGER_REGEX}
 */
const isDecimalString = (data: string): boolean => {
    return INTEGER_REGEX.test(data);
};

/**
 * Checks whether the provided string is a valid decimal numeric string.
 *
 * @param {string} value - The value to check.
 * @returns {boolean} - Returns true if the value is numeric, false otherwise.
 *
 * @see {@link NUMERIC_REGEX}
 */
const isNumeric = (value: string): boolean => {
    return NUMERIC_REGEX.test(value);
};

export const dataUtils = {
    decodeBytes32String,
    encodeBytes32String,
    isDecimalString,
    isNumeric
};
