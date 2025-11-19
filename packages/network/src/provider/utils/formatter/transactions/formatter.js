"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatExpandedBlockToRPCStandard = exports.formatToRPCStandard = void 0;
exports.formatTransactionReceiptToRPCStandard = formatTransactionReceiptToRPCStandard;
const sdk_core_1 = require("@vechain/sdk-core");
const transaction_helpers_1 = require("../../helpers/transaction/transaction-helpers");
const blocks_1 = require("../blocks");
/**
 * Maps VeChain transaction types to Ethereum transaction types.
 * - VeChain Type 0 (legacy) maps to Ethereum Type 0 (legacy) -> '0x0'
 * - VeChain Type 81 (0x51, EIP1559) maps to Ethereum Type 2 (EIP-1559) -> '0x2'
 *
 * @param vechainType - The VeChain transaction type (0 or 81)
 * @returns The Ethereum transaction type as a hex string ('0x0' or '0x2')
 */
const mapVeChainTypeToEthereumType = (vechainType) => {
    // If vechainType is undefined, null, or not a number, default to 0 (legacy)
    if (vechainType === undefined ||
        vechainType === null ||
        typeof vechainType !== 'number') {
        return '0x0';
    }
    // Type 81 (EIP1559) in VeChain corresponds to Type 2 (EIP-1559) in Ethereum
    if (vechainType === (0, sdk_core_1.fromTransactionType)(sdk_core_1.TransactionType.EIP1559)) {
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
const _formatTransactionToRPC = (tx, blockHash, blockNumber, chainId, txIndex) => {
    // Default to legacy transaction type if 'type' property doesn't exist
    const txType = 'type' in tx ? tx.type : 0;
    return {
        // Supported fields
        blockHash,
        blockNumber: sdk_core_1.Quantity.of(blockNumber).toString(),
        from: tx.origin,
        gas: sdk_core_1.Quantity.of(sdk_core_1.HexUInt.of(tx.gas).bi).toString(),
        chainId,
        hash: tx.id,
        nonce: tx.nonce,
        transactionIndex: sdk_core_1.Quantity.of(txIndex).toString(),
        /**
         * `input`, `to`, `value` are being referred to the first clause.
         * VeChain supports multiple clauses in one transaction, thus the actual data should be obtained by looking into each clause.
         * Due to the single clause limitation of Ethereum, we assume the first clause is the clause from which we obtain the data.
         */
        input: tx.clauses[0]?.data ?? '',
        to: tx.clauses[0]?.to ?? null,
        value: tx.clauses[0]?.value !== undefined
            ? sdk_core_1.Quantity.of(sdk_core_1.HexUInt.of(tx.clauses[0].value).bi).toString()
            : '',
        type: mapVeChainTypeToEthereumType(txType),
        maxFeePerGas: tx.maxFeePerGas !== undefined && tx.maxFeePerGas !== null
            ? sdk_core_1.Quantity.of(sdk_core_1.HexUInt.of(tx.maxFeePerGas).bi).toString()
            : undefined,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas !== undefined &&
            tx.maxPriorityFeePerGas !== null
            ? sdk_core_1.Quantity.of(sdk_core_1.HexUInt.of(tx.maxPriorityFeePerGas).bi).toString()
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
const formatToRPCStandard = (tx, chainId, txIndex) => {
    return _formatTransactionToRPC(tx, tx.meta.blockID, tx.meta.blockNumber, chainId, txIndex);
};
exports.formatToRPCStandard = formatToRPCStandard;
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
const formatExpandedBlockToRPCStandard = (tx, block, txIndex, chainId) => {
    return _formatTransactionToRPC(tx, block.id, block.number, chainId, txIndex);
};
exports.formatExpandedBlockToRPCStandard = formatExpandedBlockToRPCStandard;
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
function formatTransactionReceiptToRPCStandard(transactionHash, receipt, transaction, blockContainsTransaction, chainId) {
    // Get transaction index
    const transactionIndex = (0, transaction_helpers_1.getTransactionIndexIntoBlock)(blocks_1.blocksFormatter.formatToRPCStandard(blockContainsTransaction, chainId), transactionHash);
    // Format transaction receipt logs
    const logIndexOffset = (0, transaction_helpers_1.getNumberOfLogsAheadOfTransactionIntoBlockExpanded)(blockContainsTransaction, transactionHash, chainId);
    const logs = [];
    let logIndex = logIndexOffset;
    receipt.outputs.forEach((output) => {
        output.events.forEach((event) => {
            logs.push({
                blockHash: receipt.meta.blockID,
                blockNumber: sdk_core_1.Quantity.of(receipt.meta.blockNumber).toString(),
                transactionHash: receipt.meta.txID,
                address: event.address,
                topics: event.topics.map((topic) => topic),
                data: event.data,
                removed: false,
                transactionIndex: sdk_core_1.Quantity.of(transactionIndex).toString(),
                logIndex: sdk_core_1.Quantity.of(logIndex).toString()
            });
            logIndex++;
        });
    });
    // Default to legacy transaction type if 'type' property doesn't exist
    const txType = 'type' in transaction ? transaction.type : 0;
    return {
        blockHash: receipt.meta.blockID,
        blockNumber: sdk_core_1.Quantity.of(receipt.meta.blockNumber).toString(),
        contractAddress: receipt.outputs.length > 0
            ? receipt.outputs[0].contractAddress
            : null,
        from: transaction.origin,
        gasUsed: sdk_core_1.Quantity.of(receipt.gasUsed).toString(),
        logs,
        status: receipt.reverted ? '0x0' : '0x1',
        to: transaction.clauses[0].to,
        transactionHash: receipt.meta.txID,
        transactionIndex: sdk_core_1.Quantity.of(transactionIndex).toString(),
        // Incompatible fields
        logsBloom: sdk_core_1.Hex.of((0, sdk_core_1.ZERO_BYTES)(256)).toString(),
        cumulativeGasUsed: '0x0',
        effectiveGasPrice: '0x0',
        type: mapVeChainTypeToEthereumType(txType)
    };
}
