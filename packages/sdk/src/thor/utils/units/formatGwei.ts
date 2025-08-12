import { formatUnits, gweiUnits } from 'viem';

/**
 * Format a gwei value to a string representation of the value in the specified unit.
 *
 * @param {bigint} gwei - The gwei value to format.
 * @param {'wei'} unit - The unit to format the value in.
 * @returns {string} - The formatted value.
 */
function formatGwei(gwei: bigint, unit: 'wei' = 'wei'): string {
    return formatUnits(gwei, gweiUnits[unit]);
}

export { formatGwei };
