import {
    type CompressedBlockDetail,
    type ExpandedBlockDetail,
    type TransactionsExpandedBlockDetail
} from '@vechain/sdk-network';
import { type BlocksRPC } from './types';
import { dataUtils, Quantity, ZERO_BUFFER } from '@vechain/sdk-core';

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
        sha3Uncles: dataUtils.toHexString(ZERO_BUFFER(32), {
            withPrefix: true
        }),
        nonce: dataUtils.toHexString(ZERO_BUFFER(8), {
            withPrefix: true
        }),
        logsBloom: dataUtils.toHexString(ZERO_BUFFER(256), {
            withPrefix: true
        }),
        extraData: '0x0',
        baseFeePerGas: '0x0',
        mixHash: dataUtils.toHexString(ZERO_BUFFER(32), {
            withPrefix: true
        })
    };
};

export { formatToRPCStandard };
