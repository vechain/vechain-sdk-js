"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumberOfLogsAheadOfTransactionIntoBlockExpanded = exports.getTransactionIndexIntoBlock = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const formatter_1 = require("../../formatter");
/**
 * Get the index of the transaction in the specified block.
 *
 * @param block - The block to search in.
 * @param hash - The hash of the transaction to search for.
 * @returns the index of the transaction in the block or null if the transaction is not in the block.
 * @throws {InvalidDataType}
 */
const getTransactionIndexIntoBlock = (block, hash) => {
    const idx = typeof block.transactions[0] === 'string'
        ? block.transactions.findIndex((tx) => tx === hash)
        : block.transactions.findIndex((tx) => tx.hash === hash);
    if (idx === -1) {
        throw new sdk_errors_1.InvalidDataType('getTransactionIndexIntoBlock()', 'Transaction not found in block.', { block, hash });
    }
    return idx;
};
exports.getTransactionIndexIntoBlock = getTransactionIndexIntoBlock;
/**
 * Get the number of logs ahead of a transaction into a block.
 *
 * @param blockExpanded - The block to search in.
 * @param transactionId - The hash of the transaction to search for.
 * @param chainId - The chain ID of the network.
 */
const getNumberOfLogsAheadOfTransactionIntoBlockExpanded = (blockExpanded, transactionId, chainId) => {
    // Get transaction index into the block
    const transactionIndex = getTransactionIndexIntoBlock(formatter_1.blocksFormatter.formatToRPCStandard(blockExpanded, chainId), transactionId);
    // Count the number of logs in the txs whose number is lower than txId
    let logIndex = 0;
    // Iterate over the transactions into the block bounded by the transaction index
    for (let i = 0; i < transactionIndex; i++) {
        const currentTransaction = blockExpanded.transactions[i];
        // Iterate over the outputs of the current transaction
        for (const output of currentTransaction.outputs) {
            logIndex += output.events.length;
        }
    }
    return logIndex;
};
exports.getNumberOfLogsAheadOfTransactionIntoBlockExpanded = getNumberOfLogsAheadOfTransactionIntoBlockExpanded;
