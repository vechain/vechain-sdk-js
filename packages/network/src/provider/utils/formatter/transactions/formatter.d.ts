import { type TransactionReceiptRPC, type TransactionRPC } from './types';
import { type ExpandedBlockDetail, type TransactionDetailNoRaw, type TransactionReceipt, type TransactionsExpandedBlockDetail } from '../../../../thor-client';
/**
 * Output formatter for Transaction details.
 * It converts the Transaction details into the RPC standard.
 *
 * @param tx - The Transaction details to be formatted.
 * @param chainId - The chain ID of the network.
 * @param txIndex - The index of the transaction in the block.
 *
 * @returns The RPC standard formatted transaction.
 */
declare const formatToRPCStandard: (tx: TransactionDetailNoRaw, chainId: string, txIndex: number) => TransactionRPC;
/**
 * Output formatter for Transaction details from expanded block.
 * It converts the Transaction details into the RPC standard.
 *
 * @param tx - The Transaction details to be formatted.
 * @param block - The block details to be formatted.
 * @param chainId - The chain ID of the network.
 * @param txIndex - The index of the transaction in the block.
 *
 * @returns The RPC standard formatted transaction.
 */
declare const formatExpandedBlockToRPCStandard: (tx: TransactionsExpandedBlockDetail, block: ExpandedBlockDetail, txIndex: number, chainId: string) => TransactionRPC;
/**
 * Output formatter for Transaction Receipt details.
 * It converts the Transaction Receipt details, Transaction details and block into the RPC standard.
 *
 * @param transactionHash - The hash of the transaction to be formatted.
 * @param receipt - The Transaction Receipt to be formatted.
 * @param transaction - The Transaction details to be formatted.
 * @param blockContainsTransaction - The block contains the transaction to be formatted.
 * @param chainId - The chain ID of the network.
 */
declare function formatTransactionReceiptToRPCStandard(transactionHash: string, receipt: TransactionReceipt, transaction: TransactionDetailNoRaw, blockContainsTransaction: ExpandedBlockDetail, chainId: string): TransactionReceiptRPC;
export { formatToRPCStandard, formatExpandedBlockToRPCStandard, formatTransactionReceiptToRPCStandard };
//# sourceMappingURL=formatter.d.ts.map