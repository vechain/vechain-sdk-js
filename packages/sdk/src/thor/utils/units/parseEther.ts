import { etherUnits, parseUnits } from 'viem';

/**
 * Parse a string value to a bigint representation of the value in the specified unit.
 *
 * @param {string} value - The string value to parse.
 * @param {'wei' | 'gwei'} unit - The unit to parse the value in.
 * @returns {bigint} - The parsed value.
 */
function parseEther(ether: string, unit: 'wei' | 'gwei' = 'wei'): bigint {
    return parseUnits(ether, etherUnits[unit]);
}

export { parseEther };
