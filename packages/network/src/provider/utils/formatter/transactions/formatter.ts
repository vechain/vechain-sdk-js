import {
    type TransactionReceiptLogsRPC,
    type TransactionReceiptRPC,
    type TransactionRPC
} from './types';
import {
    fromTransactionType,
    Hex,
    HexUInt,
    Quantity,
    TransactionType,
    ZERO_BYTES
} from '@vechain/sdk-core';
import {
    getNumberOfLogsAheadOfTransactionIntoBlockExpanded,
    getTransactionIndexIntoBlock
} from '../../helpers/transaction/transaction-helpers';
import { blocksFormatter } from '../blocks';
import {
    type ExpandedBlockDetail,
    type TransactionDetailNoRaw,
    type TransactionReceipt,
    type TransactionsExpandedBlockDetail
} from '../../../../thor-client';

/**
 * Maps VeChain transaction types to Ethereum transaction types.
 * - VeChain Type 0 (legacy) maps to Ethereum Type 0 (legacy) -> '0x0'
 * - VeChain Type 81 (0x51, EIP1559) maps to Ethereum Type 2 (EIP-1559) -> '0x2'
 *
 * @param vechainType - The VeChain transaction type (0 or 81)
 * @returns The Ethereum transaction type as a hex string ('0x0' or '0x2')
 */
const mapVeChainTypeToEthereumType = (
    vechainType: number | undefined | null
): '0x0' | '0x2' => {
    // If vechainType is undefined, null, or not a number, default to 0 (legacy)
    if (
        vechainType === undefined ||
        vechainType === null ||
        typeof vechainType !== 'number'
    ) {
        return '0x0';
    }

    // Type 81 (EIP1559) in VeChain corresponds to Type 2 (EIP-1559) in Ethereum
    if (vechainType === fromTransactionType(TransactionType.EIP1559)) {
        return '0x2';
    }
    // Default to legacy transaction type (0x0)
    return '0x0';
};

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
const _formatTransactionToRPC = (
    tx: TransactionDetailNoRaw | TransactionsExpandedBlockDetail,
    blockHash: string,
    blockNumber: number,
    chainId: string,
    txIndex: number
): TransactionRPC => {
    // Default to legacy transaction type if 'type' property doesn't exist
    const txType = 'type' in tx ? tx.type : 0;

    return {
        // Supported fields
        blockHash,
        blockNumber: Quantity.of(blockNumber).toString(),
        from: tx.origin,
        gas: Quantity.of(HexUInt.of(tx.gas).bi).toString(),
        chainId,
        hash: tx.id,
        nonce: tx.nonce as string,
        transactionIndex: Quantity.of(txIndex).toString(),

        /**
         * `input`, `to`, `value` are being referred to the first clause.
         * VeChain supports multiple clauses in one transaction, thus the actual data should be obtained by looking into each clause.
         * Due to the single clause limitation of Ethereum, we assume the first clause is the clause from which we obtain the data.
         */
        input: tx.clauses[0]?.data ?? '',
        to: tx.clauses[0]?.to ?? null,
        value:
            tx.clauses[0]?.value !== undefined
                ? Quantity.of(HexUInt.of(tx.clauses[0].value).bi).toString()
                : '',

        type: mapVeChainTypeToEthereumType(txType),
        maxFeePerGas:
            tx.maxFeePerGas !== undefined && tx.maxFeePerGas !== null
                ? Quantity.of(HexUInt.of(tx.maxFeePerGas).bi).toString()
                : undefined,
        maxPriorityFeePerGas:
            tx.maxPriorityFeePerGas !== undefined &&
            tx.maxPriorityFeePerGas !== null
                ? Quantity.of(HexUInt.of(tx.maxPriorityFeePerGas).bi).toString()
                : undefined,

        // Unsupported fields
        gasPrice: '0x0',
        v: '0x0',
        r: '0x0',
        s: '0x0',
        accessList: [],
        yParity: '0x0'
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
): TransactionRPC => {
    return _formatTransactionToRPC(
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
const formatExpandedBlockToRPCStandard = (
    tx: TransactionsExpandedBlockDetail,
    block: ExpandedBlockDetail,
    txIndex: number,
    chainId: string
): TransactionRPC => {
    return _formatTransactionToRPC(
        tx,
        block.id,
        block.number,
        chainId,
        txIndex
    );
};

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
function formatTransactionReceiptToRPCStandard(
    transactionHash: string,
    receipt: TransactionReceipt,
    transaction: TransactionDetailNoRaw,
    blockContainsTransaction: ExpandedBlockDetail,
    chainId: string
): TransactionReceiptRPC {
    // Get transaction index
    const transactionIndex = getTransactionIndexIntoBlock(
        blocksFormatter.formatToRPCStandard(blockContainsTransaction, chainId),
        transactionHash
    );

    // Format transaction receipt logs
    const logIndexOffset = getNumberOfLogsAheadOfTransactionIntoBlockExpanded(
        blockContainsTransaction,
        transactionHash,
        chainId
    );

    const logs: TransactionReceiptLogsRPC[] = [];
    let logIndex = logIndexOffset;
    receipt.outputs.forEach((output) => {
        output.events.forEach((event) => {
            logs.push({
                blockHash: receipt.meta.blockID,
                blockNumber: Quantity.of(receipt.meta.blockNumber).toString(),
                transactionHash: receipt.meta.txID as string,
                address: event.address,
                topics: event.topics.map((topic) => topic),
                data: event.data,
                removed: false,
                transactionIndex: Quantity.of(transactionIndex).toString(),
                logIndex: Quantity.of(logIndex).toString()
            });
            logIndex++;
        });
    });

    // Default to legacy transaction type if 'type' property doesn't exist
    const txType = 'type' in transaction ? transaction.type : 0;

    return {
        blockHash: receipt.meta.blockID,
        blockNumber: Quantity.of(receipt.meta.blockNumber).toString(),
        contractAddress:
            receipt.outputs.length > 0
                ? receipt.outputs[0].contractAddress
                : null,
        from: transaction.origin,
        gasUsed: Quantity.of(receipt.gasUsed).toString(),
        logs,
        status: receipt.reverted ? '0x0' : '0x1',
        to: transaction.clauses[0].to,
        transactionHash: receipt.meta.txID as string,
        transactionIndex: Quantity.of(transactionIndex).toString(),

        // Incompatible fields
        logsBloom: Hex.of(ZERO_BYTES(256)).toString(),
        cumulativeGasUsed: '0x0',
        effectiveGasPrice: '0x0',
        type: mapVeChainTypeToEthereumType(txType)
    };
}

export {
    formatToRPCStandard,
    formatExpandedBlockToRPCStandard,
    formatTransactionReceiptToRPCStandard
};
