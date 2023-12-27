import { ethers } from 'ethers';
import {
    DECIMAL_INTEGER_REGEX,
    HEX_REGEX,
    HEX_REGEX_OPTIONAL_PREFIX,
    NUMERIC_REGEX,
    THOR_ID_LENGTH
} from '../const';
import { type HexConfig } from './types';
import {
    DATA,
    buildError,
    assert
} from '@vechainfoundation/vechain-sdk-errors';

/**
 * Convert data to a hexadecimal string representation.
 *
 * @remarks
 * This function takes a `string` or `Uint8Array` and converts it into a hexadecimal string.
 * The resulting string can optionally be prefixed with '0x' based on the configuration provided.
 *
 * @param data - The input data to be converted, either a string or a Uint8Array.
 * @param config - An optional configuration object that may include a `withPrefix` boolean, which, if true, prefixes the resulting string with '0x'.
 * @returns The hexadecimal string representation of the input data.
 */
const toHexString = (data: string | Uint8Array, config?: HexConfig): string => {
    return `${config?.withPrefix === true ? '0x' : ''}${Buffer.from(
        data
    ).toString('hex')}`;
};

/**
 * Checks whether the provided data is a valid hexadecimal string.
 *
 * @remarks
 * The check can optionally validate the presence of a '0x' prefix.
 *
 * @param data - The string data to check.
 * @param checkPrefix - A boolean determining whether to validate the '0x' prefix (default: false).
 * @returns A boolean indicating whether the input is a valid hexadecimal string.
 */
const isHexString = (data: string, checkPrefix: boolean = true): boolean => {
    return checkPrefix
        ? HEX_REGEX.test(data)
        : HEX_REGEX_OPTIONAL_PREFIX.test(data);
};

/**
 * Pads a hexadecimal string to a fixed length by adding zeros to the left.
 *
 * @param {string} hexString - The original hexadecimal string to pad. It can optionally start with '0x'.
 * @param {number} [hexTargetLength=64] - The desired length in characters for the output string. Defaults to vechain data length of 64 characters if not specified. If the value is less than or equal to str.length, then str is returned as-is.
 * @returns {string} - The padded hexadecimal string, starting with '0x' and with length matching the specified number of characters.
 *
 * @example
 * // returns '0x000000000000000000000000000000000000000000000000000000000000001a'
 * padHexString('1a', 64);
 */
function padHexString(hexString: string, hexTargetLength: number = 64): string {
    // Check if the input length is an integer, if not throw an error
    if (!Number.isInteger(hexTargetLength)) {
        throw buildError(
            DATA.INVALID_DATA_TYPE,
            `The target length '${hexTargetLength}' must be an integer.`,
            { hexTargetLength }
        );
    }

    // Remove the '0x' prefix if present
    if (hexString.startsWith('0x')) {
        hexString = hexString.slice(2);
    }

    // Pad the string with zeros on the left and add the '0x' prefix back
    return '0x' + hexString.padStart(hexTargetLength, '0');
}

/**
 * Checks whether the provided data is a valid decimal string.
 *
 * @remarks
 * Validation is performed based on a regular expression for decimal values.
 *
 * @param data - The string data to check.
 * @returns A boolean indicating whether the input is a valid decimal string.
 */
const isDecimalString = (data: string): boolean => {
    return DECIMAL_INTEGER_REGEX.test(data);
};

/**
 * Remove the '0x' prefix from a hexadecimal string.
 *
 * @remarks
 * If the input hexadecimal string starts with '0x', it is removed. If the input string does not start with '0x', it is returned unmodified.
 *
 * @param hex - The input hexadecimal string.
 * @returns The hexadecimal string without the '0x' prefix.
 */
const removePrefix = (hex: string): string => {
    if (hex.startsWith('0x')) {
        return hex.slice(2);
    }
    return hex;
};

/**
 * Checks whether the provided string is a valid decimal numeric string.
 * @param value - The string to check.
 * @returns - A boolean indicating whether the input is a valid numeric string.
 */
const isNumeric = (value: string): boolean => {
    if (typeof value !== 'string') return false;

    return NUMERIC_REGEX.test(value);
};

/**
 * Checks whether the provided data is a valid transaction thor id.
 * Thor id is a 64 characters long hexadecimal string.
 * It is used to identify a transaction id, a block id, ....
 *
 * @remarks
 * The check can optionally validate the presence of a '0x' prefix.
 *
 * @param data - The string data to check.
 * @param checkPrefix - A boolean determining whether to validate the '0x' prefix (default: false).
 * @returns A boolean indicating whether the input is a valid hexadecimal string.
 */
const isThorId = (data: string, checkPrefix: boolean = false): boolean => {
    return (
        isHexString(data, checkPrefix) &&
        (checkPrefix
            ? data.length === THOR_ID_LENGTH + 2 // +2 for '0x'
            : data.length === THOR_ID_LENGTH)
    );
};

/**
 * Encode a string to bytes32 string.
 * An example of usage is to encode a string to bytes32 string to be used as a parameter for a smart contract function.
 *
 * @param value - The string to encode.
 * @param zeroPadding - The zero padding direction. Represents on which side of the encoded bytes32 string the zeros will be padded.
 *                      The default value is 'left'.
 * @returns The encoded bytes32 string as a hex string.
 *
 * @throws If the value cannot be encoded to bytes32 string. (e.g. if the value is longer than 32 bytes)
 */
const encodeBytes32String = (
    value: string,
    zeroPadding: 'left' | 'right' = 'left'
): string => {
    try {
        const valueInBytes = ethers.toUtf8Bytes(value);
        return zeroPadding === 'left'
            ? ethers.zeroPadValue(valueInBytes, 32) // calls internal `zeroPad` ethers method which pads zeros to the left
            : ethers.zeroPadBytes(valueInBytes, 32); // calls internal `zeroPad` ethers method which pads zeros to the right
    } catch (e) {
        throw buildError(
            DATA.INVALID_DATA_TYPE,
            `Encoding to bytes32 failed: Value '${value}' exceeds 32 bytes or is otherwise invalid.`,
            { value, zeroPadding },
            e
        );
    }
};

/**
 * Decode a bytes32 hex string to a string. The bytes32 string can be padded with zeros to the left or right.
 * An example of usage is to decode a bytes32 string returned by a smart contract function.
 *
 * @param value - The bytes32 hex string to decode.
 * @returns The decoded string.
 *
 * @throws If the value cannot be decoded to string. (e.g. if the value is not a valid hex string or it is not 64 characters long)
 */
const decodeBytes32String = (value: string): string => {
    assert(
        isHexString(value) && removePrefix(value).length === 64,
        DATA.INVALID_DATA_TYPE,
        `Failed to decode value ${value} to string. Value is not a valid hex string or it is not 64 characters long`,
        { value }
    );

    const valueInBytes = Buffer.from(removePrefix(value), 'hex');

    // find the first zero byte
    const firstZeroIndex = valueInBytes.findIndex((byte) => byte === 0);

    // if the first byte is zero, then the encoded bytes 32 string is padded with zeros to the left
    if (firstZeroIndex === 0) {
        // find the first non zero byte
        const nonZeroIndex = valueInBytes.findIndex((byte) => byte !== 0);

        // Decode the encoded bytes 32 string to string by removing the padded zeros
        return ethers.toUtf8String(valueInBytes.subarray(nonZeroIndex));
    } else if (firstZeroIndex !== -1) {
        // Decode the encoded bytes 32 string to string by removing the padded zeros
        return ethers.toUtf8String(valueInBytes.subarray(0, firstZeroIndex));
    } else {
        // The encoded bytes 32 string is not padded with zeros
        return ethers.toUtf8String(valueInBytes);
    }
};

export const dataUtils = {
    toHexString,
    isHexString,
    padHexString,
    removePrefix,
    isDecimalString,
    isNumeric,
    isThorId,
    encodeBytes32String,
    decodeBytes32String
};
