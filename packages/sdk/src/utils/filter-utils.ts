import { type Address } from '@index';
import { type Hex } from '@/vcdm';

// Use the same type definitions as in PublicClient
type ThorId = string | Uint8Array | Hex;
type BlockRevision = bigint | number | string | Uint8Array | Hex;

/**
 * Helper method to convert BlockRevision to a number value if possible
 * @param blockRevision Block revision to convert
 * @returns Number value or undefined if conversion not possible
 */
function convertBlockRevisionToNumber(
    blockRevision: BlockRevision
): number | undefined {
    if (typeof blockRevision === 'number') {
        return blockRevision;
    }
    if (
        typeof blockRevision === 'string' ||
        typeof blockRevision === 'bigint'
    ) {
        return Number(blockRevision);
    }
    return undefined;
}

/**
 * Helper method to handle address filtering
 * @param address Single address or array of addresses
 * @returns Address string in VeChain format
 */
function handleAddressFilter(
    address: Address | Address[] | undefined
): string | undefined {
    if (address == null) {
        return undefined;
    }
    if (Array.isArray(address)) {
        return address.length > 0 ? String(address[0]) : undefined;
    }
    return String(address);
}

/**
 * Helper method to prepare a block range filter
 * @param fromBlock Starting block revision
 * @param toBlock Ending block revision
 * @returns Range object for the filter request
 */
function prepareBlockRange(
    fromBlock?: BlockRevision,
    toBlock?: BlockRevision
): Record<string, string | number> {
    // Prepare range filter if fromBlock or toBlock is provided
    const range: Record<string, string | number> = {};

    // Handle fromBlock
    const fromValue =
        fromBlock !== undefined
            ? convertBlockRevisionToNumber(fromBlock)
            : undefined;
    if (fromValue !== undefined) {
        range.from = fromValue;
        range.unit = 'block';
    }

    // Handle toBlock
    const toValue =
        toBlock !== undefined
            ? convertBlockRevisionToNumber(toBlock)
            : undefined;
    if (toValue !== undefined) {
        range.to = toValue;
        range.unit = 'block';
    }

    return range;
}

/**
 * Helper method to handle event arguments (indexed parameters)
 * @param args Array of indexed parameters
 * @returns Record of topic keys and values
 */
function handleEventArgs(args?: ThorId[]): Record<string, string> {
    const topicValues: Record<string, string> = {};

    if (args != null && args.length > 0) {
        for (let i = 0; i < Math.min(args.length, 3); i++) {
            if (args[i] != null && Boolean(args[i])) {
                topicValues[`t${i + 1}`] = String(args[i]);
            }
        }
    }

    return topicValues;
}

export {
    handleAddressFilter,
    handleEventArgs,
    prepareBlockRange,
    convertBlockRevisionToNumber
};
