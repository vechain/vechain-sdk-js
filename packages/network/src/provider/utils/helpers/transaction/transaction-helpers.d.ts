import { type BlocksRPC } from '../../formatter';
import { type ExpandedBlockDetail } from '../../../../thor-client';
/**
 * Get the index of the transaction in the specified block.
 *
 * @param block - The block to search in.
 * @param hash - The hash of the transaction to search for.
 * @returns the index of the transaction in the block or null if the transaction is not in the block.
 * @throws {InvalidDataType}
 */
declare const getTransactionIndexIntoBlock: (block: BlocksRPC, hash: string) => number;
/**
 * Get the number of logs ahead of a transaction into a block.
 *
 * @param blockExpanded - The block to search in.
 * @param transactionId - The hash of the transaction to search for.
 * @param chainId - The chain ID of the network.
 */
declare const getNumberOfLogsAheadOfTransactionIntoBlockExpanded: (blockExpanded: ExpandedBlockDetail, transactionId: string, chainId: string) => number;
export { getTransactionIndexIntoBlock, getNumberOfLogsAheadOfTransactionIntoBlockExpanded };
//# sourceMappingURL=transaction-helpers.d.ts.map