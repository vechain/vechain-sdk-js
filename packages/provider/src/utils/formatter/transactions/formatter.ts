import {
    type TransactionsExpandedBlockDetail,
    type TransactionDetailNoRaw,
    type BlockDetail
} from '@vechain/vechain-sdk-network';
import { type TransactionReturnTypeRPC } from './types';
import { vechain_sdk_core_ethers } from '@vechain/vechain-sdk-core';

/**
 * Output formatter for Transaction details.
 *
 * @param tx - The Transaction details to be formatted.
 * @param blockHash - The hash of the block where the transaction is in.
 * @param blockNumber - The number of the block where the transaction is in.
 * @param chainId - The chain ID of the network.
 * @param txIndex - The index of the transaction in the block.
 *
 * @returns The RPC standard formatted transaction.
 */
const formatTransactionToRPC = (
    tx: TransactionDetailNoRaw | TransactionsExpandedBlockDetail,
    blockHash: string,
    blockNumber: number,
    chainId: string,
    txIndex: number
): TransactionReturnTypeRPC => {
    return {
        // Supported fields
        blockHash,
        blockNumber: vechain_sdk_core_ethers.toQuantity(blockNumber),
        from: tx.origin,
        gas: vechain_sdk_core_ethers.toQuantity(tx.gas),
        chainId,
        hash: tx.id,
        nonce: tx.nonce as string,
        transactionIndex: vechain_sdk_core_ethers.toQuantity(txIndex),

        /**
         * `input`, `to`, `value` are being referred to the first clause.
         * Vechain supports multiple clauses in one transaction, thus the actual data should obtained by looking into each clause.
         * Due to the single clause limitation of Ethereum, we assume the first clause is the clause from which we obtain the data.
         */
        input: tx.clauses[0].data,
        to: tx.clauses[0].to,
        value: vechain_sdk_core_ethers.toQuantity(tx.clauses[0].value),

        // Unsupported fields
        gasPrice: '0x',
        type: '0x',
        v: '0x',
        r: '0x',
        s: '0x',
        accessList: [],
        maxFeePerGas: '0x',
        maxPriorityFeePerGas: '0x',
        yParity: '0x'
    };
};

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
const formatToRPCStandard = (
    tx: TransactionDetailNoRaw,
    chainId: string,
    txIndex: number
): TransactionReturnTypeRPC => {
    return formatTransactionToRPC(
        tx,
        tx.meta.blockID,
        tx.meta.blockNumber,
        chainId,
        txIndex
    );
};

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
const formatToRPCStandardFromExpandedBlock = (
    tx: TransactionsExpandedBlockDetail,
    block: BlockDetail,
    txIndex: number,
    chainId: string
): TransactionReturnTypeRPC => {
    return formatTransactionToRPC(tx, block.id, block.number, chainId, txIndex);
};

export { formatToRPCStandard, formatToRPCStandardFromExpandedBlock };
