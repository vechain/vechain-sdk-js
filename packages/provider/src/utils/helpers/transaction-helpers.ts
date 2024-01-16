import { DATA, buildError } from '@vechain/vechain-sdk-errors';
import {
    type TransactionReturnTypeRPC,
    type BlocksReturnTypeRPC
} from '../formatter';

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
const getTransactionIndex = (
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

export { getTransactionIndex };
