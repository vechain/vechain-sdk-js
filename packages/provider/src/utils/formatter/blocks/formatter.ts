import {
    type TransactionsExpandedBlockDetail,
    type BlockDetail
} from '@vechain/vechain-sdk-network';
import { type BlocksRPC } from './types';
import {
    dataUtils,
    vechain_sdk_core_ethers,
    ZERO_BUFFER
} from '@vechain/vechain-sdk-core';

import { transactionsFormatter } from '../transactions';
import { Hex } from '@vechain/vechain-sdk-core/src/utils/hex/Hex';

/**
 * Output formatter for block details.
 * It converts the block details into the RPC standard.
 *
 * @param block - The block details to be formatted.
 * @param chainId - The chain id to use for the transaction formatting.
 */
const formatToRPCStandard = (
    block: BlockDetail,
    chainId: string
): BlocksRPC => {
    // Return the transactions array formatted based on the requested expanded flag
    const transactions =
        typeof block.transactions[0] === 'string'
            ? (block.transactions as string[])
            : block.transactions.map((tx, index) => {
                  return transactionsFormatter.formatExpandedBlockToRPCStandard(
                      tx as TransactionsExpandedBlockDetail,
                      block,
                      index,
                      chainId
                  );
              });

    return {
        // Supported fields converted to RPC standard
        hash: block.id,
        parentHash: block.parentID,
        number: Hex.of(block.number),
        size: Hex.of(block.size),
        stateRoot: block.stateRoot,
        receiptsRoot: block.receiptsRoot,
        transactionsRoot: block.txsRoot,
        timestamp: Hex.of(block.timestamp),
        gasLimit: Hex.of(block.gasLimit),
        gasUsed: vechain_sdk_core_ethers.toQuantity(block.gasUsed),
        transactions,
        miner: block.beneficiary,

        // Unsupported fields
        difficulty: '0x0',
        totalDifficulty: '0x0',
        uncles: [],
        sha3Uncles: Hex.of0x(ZERO_BUFFER(32)),
        nonce: Hex.of0x(ZERO_BUFFER(8)),
        logsBloom: Hex.of0x(ZERO_BUFFER(256)),
        extraData: '0x',
        baseFeePerGas: '0x',
        mixHash: Hex.of0x(ZERO_BUFFER(32))
    };
};

export { formatToRPCStandard };
