import { DECIMAL_REGEX, HEX_REGEX, HEX_REGEX_OPTIONAL_PREFIX } from '../const';
import { type HexString } from '../types';
import { type HexConfig } from './types';

/**
 * Convert data to a hexadecimal string representation.
 *
 * @remarks
 * This function takes a `string` or `Uint8Array` and converts it into a hexadecimal string.
 * The resulting string can optionally be prefixed with '0x' based on the configuration provided.
 *
 * @param data - The input data to be converted, either a string or a Uint8Array.
 * @param config - An optional configuration object that may include a `withPrefix` boolean, which if true, prefixes the resulting string with '0x'.
 * @returns The hexadecimal string representation of the input data.
 */
const toHexString = (
    data: string | Uint8Array,
    config?: HexConfig
): HexString => {
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
 * Checks whether the provided data is a valid decimal string.
 *
 * @remarks
 * Validation is performed based on a regular expression for decimal values.
 *
 * @param data - The string data to check.
 * @returns A boolean indicating whether the input is a valid decimal string.
 */
const isDecimalString = (data: string): boolean => {
    return DECIMAL_REGEX.test(data);
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
const removePrefix = (hex: HexString): string => {
    if (hex.startsWith('0x')) {
        return hex.slice(2);
    }
    return hex;
};

export const dataUtils = {
    toHexString,
    isHexString,
    removePrefix,
    isDecimalString
};
