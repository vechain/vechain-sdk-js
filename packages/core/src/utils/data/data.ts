import { HEX_REGEX } from '../const';
import { type HexString } from '../types';
import { type HexConfig } from './types';

/**
 * Convert data to a hexadecimal string representation.
 *
 * @remarks
 * This function takes a `string` or `Uint8Array` and converts it into a hexadecimal string.
 * The resulting string can optionally be prefixed with '0x' based on the configuration provided.
 *
 * @example
 * ```
 * toHexString("Hello World"); // "48656c6c6f20576f726c64"
 * toHexString("Hello World", { withPrefix: true }); // "0x48656c6c6f20576f726c64"
 * toHexString(new Uint8Array([72, 101, 108, 108, 111])); // "48656c6c6f"
 * ```
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
 * Validate whether the provided data is a hexadecimal string.
 *
 * @remarks
 * This function uses a regular expression to validate whether the input string is a valid hexadecimal string.
 * A valid hexadecimal string may optionally start with the '0x' prefix.
 *
 * @example
 * ```
 * isHexString("0x48656c6c6f"); // true
 * isHexString("G56c6c6f"); // false
 * ```
 *
 * @param data - The string to be validated.
 * @returns A boolean indicating whether the provided string is a valid hexadecimal string.
 */
const isHexString = (data: string): boolean => {
    return HEX_REGEX.test(data);
};

/**
 * Remove the '0x' prefix from a hexadecimal string.
 *
 * @remarks
 * If the input hexadecimal string starts with '0x', it is removed. If the input string does not start with '0x', it is returned unmodified.
 *
 * @example
 * ```
 * removePrefix("0x48656c6c6f"); // "48656c6c6f"
 * removePrefix("48656c6c6f"); // "48656c6c6f"
 * ```
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

export { toHexString, isHexString, removePrefix };
