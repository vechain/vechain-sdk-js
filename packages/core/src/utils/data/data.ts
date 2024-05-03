import * as utils from '@noble/curves/abstract/utils';
import { Hex0x, Hex } from '../hex';
import { INTEGER_REGEX, NUMERIC_REGEX, ZERO_BYTES } from '../const';
import { assert, buildError, DATA } from '@vechain/sdk-errors';

/**
 * Decodes a hexadecimal string representing a bytes32 value into a string.
 * The bytes32 string can be padded with zeros to the left or right.
 * An example of usage is to decode a bytes32 string returned by a smart contract function.
 *
 * @param {string} hex - The hexadecimal string to decode.
 * @returns {string} - The decoded string value.
 *
 * @throws {InvalidDataTypeError} - If the input hex string is invalid or not 64 characters long.
 */
const decodeBytes32String = (hex: string): string => {
    assert(
        'decodeBytes32String',
        Hex0x.isValid(hex) && Hex.canon(hex).length === 64,
        DATA.INVALID_DATA_TYPE,
        `Failed to decode value ${hex} to string. Value is not a valid hex string or it is not 64 characters long`,
        { value: hex }
    );
    const textDecoder = new TextDecoder();
    const valueInBytes = utils.hexToBytes(Hex.canon(hex));
    // Find the first zero byte.
    const firstZeroIndex = valueInBytes.findIndex((byte) => byte === 0);
    // If the first byte is zero, then the encoded bytes 32 string is padded with zeros to the left.
    if (firstZeroIndex === 0) {
        // Find the first non-zero byte.
        const firstNotZeroIndex = valueInBytes.findIndex((byte) => byte !== 0);
        // Decode the encoded bytes 32 string to string by removing the padded zeros.
        return textDecoder.decode(valueInBytes.subarray(firstNotZeroIndex));
    } else if (firstZeroIndex !== -1) {
        // Decode the encoded bytes 32 string to string by removing the padded zeros.
        return textDecoder.decode(valueInBytes.subarray(0, firstZeroIndex));
    } else {
        return textDecoder.decode(valueInBytes);
    }
};

/**
 * Encodes a string into a bytes32 hexadecimal expression with optional zero padding.
 * The encoded bytes32 string can be used as a parameter for a smart contract function.
 *
 * @param {string} value - The value to encode.
 * @param {'left' | 'right'} [zeroPadding='left'] - The type of zero padding to apply.
 *
 * @returns {string} The encoded bytes32 string is a hexadecimal expression prefixed with `0x.
 *
 * @throws {InvalidDataTypeError} If the value exceeds 32 bytes or fails to encode.
 */
const encodeBytes32String = (
    value: string,
    zeroPadding: 'left' | 'right' = 'right' // Default to 'right' as ethers.js does.
): string => {
    // Wrap any error raised by utf8BytesOf(value).
    try {
        const valueInBytes = new TextEncoder().encode(value);
        assert(
            'dataUtils.encodeBytes32String',
            valueInBytes.length <= 32,
            DATA.INVALID_DATA_TYPE,
            `Value '${value}' exceeds 32 bytes.`,
            { value }
        );
        const pad = ZERO_BYTES(32 - valueInBytes.length);
        return zeroPadding === 'left'
            ? Hex0x.of(utils.concatBytes(pad, valueInBytes))
            : Hex0x.of(utils.concatBytes(valueInBytes, pad));
    } catch (e) {
        throw buildError(
            'dataUtils.encodeBytes32String',
            DATA.INVALID_DATA_TYPE,
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
 *
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
 *
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
