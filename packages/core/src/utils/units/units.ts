import { ethers } from 'ethers';
import { type BigNumberish, type WEI_UNITS } from './types';
import { dataUtils } from '..';
import { assert, DATA } from '@vechain/vechain-sdk-errors';

/**
 * Parse a string number to a string with the specified number of decimals
 *
 * @param value - The value to format. In order to avoid overflow issues with 'number'
 *                only numeric strings are supported.
 *
 * @param decimals - The number of decimals to format the value to.
 *                   It can be a number, bigint or `WEI_UNITS` ('wei', 'kwei', 'mwei', 'gwei', 'szabo', 'finney', 'ether').
 *
 * @link see [ethers.js parseUnits](https://docs.ethers.org/v6/api/utils/#parseUnits)
 *
 * @returns The formatted value as a bigint
 */
const parseUnits = (
    value: string,
    decimals: WEI_UNITS | number | bigint
): bigint => {
    assert(
        'parseUnits',
        typeof value !== 'string' || dataUtils.isNumeric(value),
        DATA.INVALID_DATA_TYPE,
        `Invalid value format. The value "${value}" must be a numeric string.`,
        { value }
    );

    return ethers.parseUnits(value, decimals);
};

/**
 * Converts a value into a decimal string assuming the specified number of decimals.
 *
 * @param value - The value to format. It can be a string, number or bigint. If it is a string, it must be a valid number.
 *                Hex strings are supported.
 * @param decimals - The number of decimals to format the value to.
 *                   It can be a number, bigint or `WEI_UNITS` ('wei', 'kwei', 'mwei', 'gwei', 'szabo', 'finney', 'ether').
 *
 * @link see [ethers.js formatUnits](https://docs.ethers.org/v6/api/utils/#formatUnits)
 *
 * @returns The formatted value as a string.
 */
const formatUnits = (
    value: BigNumberish,
    decimals: WEI_UNITS | number | bigint
): string => {
    return ethers.formatUnits(value, decimals);
};

/**
 * Parses a string number to a string with 18 decimals.
 *
 * VET is the native token of the VechainThor blockchain.
 * It has 18 decimals.
 *
 * This method can parse any numeric string with 18 decimals (e.g., VTHO balance too).
 *
 * @link see [ethers.js parseEther](https://docs.ethers.org/v6/api/utils/#parseEther)
 *
 * @param value - The value to parse. It must be a valid number. Hex strings are not supported.
 * @returns The parsed value as a bigint
 */
const parseVET = (value: string): bigint => {
    return parseUnits(value, 18);
};

/**
 * Converts a value into a decimal string assuming 18 decimals.
 *
 * VET is the native token of the VechainThor blockchain.
 * It has 18 decimals.
 *
 * This method can format any numeric value with 18 decimals (e.g., VTHO balance too).
 *
 * @link see [ethers.js formatEther](https://docs.ethers.org/v6/api/utils/#formatEther)
 *
 * @param value - The value to format. It can be a string, number or bigint. If it is a string, it must be a valid number.
 *                Hex strings are supported.
 * @returns The formatted value as a string.
 */
const formatVET = (value: BigNumberish): string => {
    return formatUnits(value, 18);
};

export const unitsUtils = {
    parseUnits,
    formatUnits,
    parseVET,
    formatVET
};
