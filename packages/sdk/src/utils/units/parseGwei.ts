import { gweiUnits, parseUnits } from 'viem';

/**
 * Parse a string value to a bigint representation of the value in the specified unit.
 *
 * @param {string} value - The string value to parse.
 * @param {'wei' | 'gwei'} unit - The unit to parse the value in.
 * @returns {bigint} - The parsed value.
 */
function parseGwei(gwei: string, unit: 'wei' = 'wei'): bigint {
    return parseUnits(gwei, gweiUnits[unit]);
}

export { parseGwei };
