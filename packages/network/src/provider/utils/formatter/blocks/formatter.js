"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToRPCStandard = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const transactions_1 = require("../transactions");
/**
 * Output formatter for block details.
 * It converts the block details into the RPC standard.
 *
 * @param block - The block details to be formatted.
 * @param chainId - The chain id to use for the transaction formatting.
 */
const formatToRPCStandard = (block, chainId) => {
    // Return the transactions array formatted based on the requested expanded flag
    const transactions = typeof block.transactions[0] === 'string'
        ? block.transactions
        : block.transactions.map((tx, index) => {
            return transactions_1.transactionsFormatter.formatExpandedBlockToRPCStandard(tx, block, index, chainId);
        });
    return {
        // Supported fields converted to RPC standard
        hash: block.id,
        parentHash: block.parentID,
        number: sdk_core_1.Quantity.of(block.number).toString(),
        size: sdk_core_1.Quantity.of(block.size).toString(),
        stateRoot: block.stateRoot,
        receiptsRoot: block.receiptsRoot,
        transactionsRoot: block.txsRoot,
        timestamp: sdk_core_1.Quantity.of(block.timestamp).toString(),
        gasLimit: sdk_core_1.Quantity.of(block.gasLimit).toString(),
        gasUsed: sdk_core_1.Quantity.of(block.gasUsed).toString(),
        transactions,
        miner: block.beneficiary,
        baseFeePerGas: block.baseFeePerGas,
        // Unsupported fields
        difficulty: '0x0',
        totalDifficulty: '0x0',
        uncles: [],
        sha3Uncles: sdk_core_1.HexUInt.of((0, sdk_core_1.ZERO_BYTES)(32)).toString(),
        nonce: sdk_core_1.HexUInt.of((0, sdk_core_1.ZERO_BYTES)(8)).toString(),
        logsBloom: sdk_core_1.HexUInt.of((0, sdk_core_1.ZERO_BYTES)(256)).toString(),
        extraData: '0x',
        ...(block.baseFeePerGas !== undefined
            ? { baseFeePerGas: block.baseFeePerGas }
            : {}),
        mixHash: sdk_core_1.HexUInt.of((0, sdk_core_1.ZERO_BYTES)(32)).toString()
    };
};
exports.formatToRPCStandard = formatToRPCStandard;
