import {
    type CompressedBlockDetail,
    type ExpandedBlockDetail,
    type TransactionsExpandedBlockDetail
} from '@vechain/sdk-network';
import { type BlocksRPC } from './types';
import { H0x, Quantity, ZERO_BUFFER } from '@vechain/sdk-core';
import { transactionsFormatter } from '../transactions';

/**
 * Output formatter for block details.
 * It converts the block details into the RPC standard.
 *
 * @param block - The block details to be formatted.
 * @param chainId - The chain id to use for the transaction formatting.
 */
const formatToRPCStandard = (
    block: CompressedBlockDetail | ExpandedBlockDetail,
    chainId: string
): BlocksRPC => {
    // Return the transactions array formatted based on the requested expanded flag
    const transactions =
        typeof block.transactions[0] === 'string'
            ? (block.transactions as string[])
            : block.transactions.map((tx, index) => {
                  return transactionsFormatter.formatExpandedBlockToRPCStandard(
                      tx as TransactionsExpandedBlockDetail,
                      block as ExpandedBlockDetail,
                      index,
                      chainId
                  );
              });

    return {
        // Supported fields converted to RPC standard
        hash: block.id,
        parentHash: block.parentID,
        number: Quantity.of(block.number),
        size: Quantity.of(block.size),
        stateRoot: block.stateRoot,
        receiptsRoot: block.receiptsRoot,
        transactionsRoot: block.txsRoot,
        timestamp: Quantity.of(block.timestamp),
        gasLimit: Quantity.of(block.gasLimit),
        gasUsed: Quantity.of(block.gasUsed),
        transactions,
        miner: block.beneficiary,

        // Unsupported fields
        difficulty: '0x0',
        totalDifficulty: '0x0',
        uncles: [],
        sha3Uncles: H0x.of(ZERO_BUFFER(32)),
        nonce: H0x.of(ZERO_BUFFER(8)),
        logsBloom: H0x.of(ZERO_BUFFER(256)),
        extraData: '0x0',
        baseFeePerGas: '0x0',
        mixHash: H0x.of(ZERO_BUFFER(32))
    };
};

export { formatToRPCStandard };
