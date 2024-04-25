import * as utils from '@noble/curves/abstract/utils';
import { INTEGER_REGEX, NUMERIC_REGEX, ZERO_BYTES } from '../const';
import { Hex0x, Hex } from '../hex';
import { assert, buildError, DATA } from '@vechain/sdk-errors';

import { ethers } from 'ethers';
import { type UnicodeNormalizationForm } from './types';

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

/**
 * Encodes a string into a bytes32 string with optional zero padding.
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
    zeroPadding: 'left' | 'right' = 'left'
): string => {
    // Wrap any error raised by toUtf8Bytes(value).
    try {
        const valueInBytes = toUtf8Bytes(value);
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
 * Decode a bytes32 hex string to a string. The bytes32 string can be padded with zeros to the left or right.
 * An example of usage is to decode a bytes32 string returned by a smart contract function.
 *
 * @param hexExpression - The bytes32 hex string to decode.
 * @returns The decoded string.
 *
 * @throws If the value cannot be decoded to string. (e.g. if the value is not a valid hex string, or it is not 64 characters long)
 */

const decodeBytes32String = (hexExpression: string): string => {
    assert(
        'decodeBytes32String',
        Hex0x.isValid(hexExpression) && Hex.canon(hexExpression).length === 64,
        DATA.INVALID_DATA_TYPE,
        `Failed to decode value ${hexExpression} to string. Value is not a valid hex string or it is not 64 characters long`,
        { value: hexExpression }
    );

    const valueInBytes = utils.hexToBytes(Hex.canon(hexExpression));

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

function toUtf8Bytes(txt: string, form?: UnicodeNormalizationForm): Uint8Array {
    const result: number[] = [];
    const str = form != null ? txt.normalize(form) : txt;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);

        if (char < 0x80) {
            result.push(char);
        } else if (char < 0x800) {
            result.push((char >> 6) | 0xc0);
            result.push((char & 0x3f) | 0x80);
        } else if ((char & 0xfc00) === 0xd800) {
            i++;
            const nextChar = str.charCodeAt(i);
            assert(
                'dataUtils.toUtf8Bytes',
                i < str.length && (nextChar & 0xfc00) === 0xdc00,
                DATA.INVALID_DATA_TYPE,
                `Invalid surrogate ${nextChar} at position ${i} in ${str}.`,
                {
                    nextChar,
                    i,
                    str
                }
            );
            const surrogatePair =
                0x10000 + ((char & 0x03ff) << 10) + (nextChar & 0x03ff);
            result.push((surrogatePair >> 18) | 0xf0);
            result.push(((surrogatePair >> 12) & 0x3f) | 0x80);
            result.push(((surrogatePair >> 6) & 0x3f) | 0x80);
            result.push((surrogatePair & 0x3f) | 0x80);
        } else {
            result.push((char >> 12) | 0xe0);
            result.push(((char >> 6) & 0x3f) | 0x80);
            result.push((char & 0x3f) | 0x80);
        }
    }
    return new Uint8Array(result);
}

export const dataUtils = {
    isDecimalString,
    isNumeric,
    encodeBytes32String,
    decodeBytes32String
};
