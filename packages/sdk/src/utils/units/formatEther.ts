import { etherUnits, formatUnits } from 'viem';

/**
 * Format a wei value to a string representation of the value in the specified unit.
 *
 * @param {bigint} wei - The wei value to format.
 * @param {'wei' | 'gwei'} unit - The unit to format the value in.
 * @returns {string} - The formatted value.
 */
function formatEther(wei: bigint, unit: 'wei' | 'gwei' = 'wei'): string {
    return formatUnits(wei, etherUnits[unit]);
}

export { formatEther };
