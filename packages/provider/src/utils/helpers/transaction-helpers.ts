import { DATA, buildError } from '@vechain/vechain-sdk-errors';
import {
    type TransactionReturnTypeRPC,
    type BlocksReturnTypeRPC,
    blocksFormatter
} from '../formatter';
import {
    type BlockDetail,
    type Output,
    type TransactionsExpandedBlockDetail
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
const getTransactionIndexIntoABlock = (
    block: BlocksReturnTypeRPC,
    hash: string
): number => {
    const idx =
        typeof block.transactions[0] === 'string'
            ? (block.transactions as string[]).findIndex(
                  (tx: string) => tx === hash
              )
            : block.transactions.findIndex(
                  (tx) => (tx as TransactionReturnTypeRPC).hash === hash
              );

    if (idx === -1)
        throw buildError(
            DATA.INVALID_DATA_TYPE,
            'Transaction not found in block'
        );

    return idx;
};

const getNumberOfLogsAheadOfATransactionIntoABlockExpanded = (
    blockExpanded: BlockDetail,
    hash: string,
    chainId: string
): number => {
    // Get transaction index into the block
    const transactionIndex = getTransactionIndexIntoABlock(
        blocksFormatter.formatToRPCStandard(blockExpanded, chainId),
        hash
    );

    // Count the number of logs in the txs whose number is lower than txId
    let logIndex: number = 0;

    // Iterate over the transactions into the block bounded by the transaction index
    for (let i = 0; i < transactionIndex; i++) {
        const currentTransaction = blockExpanded.transactions[
            i
        ] as TransactionsExpandedBlockDetail;

        // Iterate over the outputs of the current transaction
        for (
            let j = 0;
            j < (currentTransaction.outputs as Output[]).length;
            j++
        ) {
            logIndex += (currentTransaction.outputs as Output[])[j].events
                .length;
        }
    }

    return logIndex;
};

export {
    getTransactionIndexIntoABlock,
    getNumberOfLogsAheadOfATransactionIntoABlockExpanded
};
