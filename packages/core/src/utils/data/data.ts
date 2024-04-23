import * as utils from '@noble/curves/abstract/utils';
import { DECIMAL_INTEGER_REGEX, NUMERIC_REGEX } from '../const';
import { Hex0x, Hex } from '../hex';
import { assert, buildError, DATA } from '@vechain/sdk-errors';

import { ethers } from 'ethers';

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
 * Checks whether the provided string is a valid decimal numeric string.
 * @param value - The string to check.
 * @returns - A boolean indicating whether the input is a valid numeric string.
 */
const isNumeric = (value: string): boolean => {
    return NUMERIC_REGEX.test(value);
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
            'encodeBytes32String',
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
 * @throws If the value cannot be decoded to string. (e.g. if the value is not a valid hex string, or it is not 64 characters long)
 */
const decodeBytes32String = (value: string): string => {
    assert(
        'decodeBytes32String',
        Hex0x.isValid(value) && Hex.canon(value).length === 64,
        DATA.INVALID_DATA_TYPE,
        `Failed to decode value ${value} to string. Value is not a valid hex string or it is not 64 characters long`,
        { value }
    );

    const valueInBytes = utils.hexToBytes(Hex.canon(value));

    // find the first zero byte
    const firstZeroIndex = valueInBytes.findIndex((byte) => byte === 0);

    // if the first byte is zero, then the encoded bytes 32 string is padded with zeros to the left
    if (firstZeroIndex === 0) {
        // find the first non-zero byte
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
    isDecimalString,
    isNumeric,
    encodeBytes32String,
    decodeBytes32String
};
