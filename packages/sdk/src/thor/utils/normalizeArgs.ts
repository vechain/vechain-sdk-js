import { Address } from '@common/vcdm';

/**
 * Normalizes VCDM types (like Address, Hex) to strings for viem compatibility.
 * This is necessary because viem's encodeFunctionData expects primitive types,
 * but users may pass VCDM types like Address or Hex which have toString() methods.
 *
 * @param arg - The argument to normalize
 * @returns The normalized argument (primitives unchanged, VCDM types converted to strings)
 */
const normalizeArg = (arg: unknown): unknown => {
    // Handle arrays recursively
    if (Array.isArray(arg)) {
        return arg.map(normalizeArg);
    }

    // Handle objects with toString method (VCDM types like Address, Hex)
    if (
        arg !== null &&
        typeof arg === 'object' &&
        'toString' in arg &&
        typeof (arg as { toString: unknown }).toString === 'function'
    ) {
        const str = (arg as { toString(): string }).toString();
        // Validate it looks like an address or hex string
        if (Address.isValid(str) || str.startsWith('0x')) {
            return str;
        }
    }

    // Return primitives (string, number, bigint, boolean) unchanged
    return arg;
};

/**
 * Normalizes an array of function arguments for viem compatibility.
 * Converts VCDM types (Address, Hex, etc.) to their string representations
 * while leaving primitive types unchanged.
 *
 * @param args - The function arguments to normalize
 * @returns Array of normalized arguments suitable for viem's encodeFunctionData
 *
 * @example
 * ```typescript
 * const address = Address.of('0x1234...');
 * const hex = Hex.of('0xabcd...');
 *
 * // VCDM types are converted to strings
 * normalizeVcdmArgs([address, hex, 123n])
 * // Returns: ['0x1234...', '0xabcd...', 123n]
 * ```
 */
export const normalizeVcdmArgs = <T extends readonly unknown[]>(args: T): T => {
    return args.map(normalizeArg) as unknown as T;
};

