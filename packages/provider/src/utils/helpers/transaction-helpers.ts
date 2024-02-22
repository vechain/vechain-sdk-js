import { DATA, buildError } from '@vechain/vechain-sdk-errors';
import {
    type TransactionRPC,
    type BlocksRPC,
    blocksFormatter
} from '../formatter';
import {
    type Output,
    type ExpandedBlockDetail
} from '@vechain/vechain-sdk-network';

/**
 * Get the index of the transaction in the specified block.
 *
 * @param block - The block to search in.
 * @param hash - The hash of the transaction to search for.
 *
 * @returns the index of the transaction in the block or null if the transaction is not in the block.
 *
 * @throws Will throw an error if the transaction is not in the block.
 */
const getTransactionIndexIntoBlock = (
    block: BlocksRPC,
    hash: string
): number => {
    const idx =
        typeof block.transactions[0] === 'string'
            ? (block.transactions as string[]).findIndex(
                  (tx: string) => tx === hash
              )
            : block.transactions.findIndex(
                  (tx) => (tx as TransactionRPC).hash === hash
              );

    if (idx === -1)
        throw buildError(
            DATA.INVALID_DATA_TYPE,
            'Transaction not found in block'
        );

    return idx;
};

/**
 * Get the number of logs ahead of a transaction into a block.
 *
 * @param blockExpanded - The block to search in.
 * @param transactionId - The hash of the transaction to search for.
 * @param chainId - The chain ID of the network.
 */
const getNumberOfLogsAheadOfTransactionIntoBlockExpanded = (
    blockExpanded: ExpandedBlockDetail,
    transactionId: string,
    chainId: string
): number => {
    // Get transaction index into the block
    const transactionIndex = getTransactionIndexIntoBlock(
        blocksFormatter.formatToRPCStandard(blockExpanded, chainId),
        transactionId
    );

    // Count the number of logs in the txs whose number is lower than txId
    let logIndex: number = 0;

    // Iterate over the transactions into the block bounded by the transaction index
    for (let i = 0; i < transactionIndex; i++) {
        const currentTransaction = blockExpanded.transactions[i];

        // Iterate over the outputs of the current transaction
        for (const output of currentTransaction.outputs as Output[]) {
            logIndex += output.events.length;
        }
    }

    return logIndex;
};

export {
    getTransactionIndexIntoBlock,
    getNumberOfLogsAheadOfTransactionIntoBlockExpanded
};
