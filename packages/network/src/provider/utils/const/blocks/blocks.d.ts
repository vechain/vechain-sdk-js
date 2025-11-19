import { Revision } from '@vechain/sdk-core';
type DefaultBlock = `0x${string}` | 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized';
/**
 * Maps the Ethereum "default block" type to VeChainThor Revision type.
 * Ethereum "default block" can be:
 * - 'latest' or 'earliest' or 'pending' or 'safe' or 'finalized'
 * - a hexadecimal block number
 * VeChainThor revision type can be:
 * - 'best', 'next', 'justified', 'finalized'
 * - a hexadecimal block Id
 * - a integer block number
 *
 * @param defaultBlock - The Ethereum default block type to convert
 * @returns The VeChainThor revision type
 */
declare const DefaultBlockToRevision: (defaultBlock: DefaultBlock) => Revision;
export { type DefaultBlock, DefaultBlockToRevision };
//# sourceMappingURL=blocks.d.ts.map