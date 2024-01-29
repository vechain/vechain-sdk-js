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
import { formatFromExpandedBlockToRPCStandard } from '../transactions/formatter';

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
                  return formatFromExpandedBlockToRPCStandard(
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
        number: vechain_sdk_core_ethers.toQuantity(block.number),
        size: vechain_sdk_core_ethers.toQuantity(block.size),
        stateRoot: block.stateRoot,
        receiptsRoot: block.receiptsRoot,
        transactionsRoot: block.txsRoot,
        timestamp: vechain_sdk_core_ethers.toQuantity(block.timestamp),
        gasLimit: vechain_sdk_core_ethers.toQuantity(block.gasLimit),
        gasUsed: vechain_sdk_core_ethers.toQuantity(block.gasUsed),
        transactions,
        miner: block.beneficiary,

        // Unsupported fields
        difficulty: '0x',
        totalDifficulty: '0x',
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
        extraData: '0x',
        baseFeePerGas: '0x',
        mixHash: dataUtils.toHexString(ZERO_BUFFER(32), {
            withPrefix: true
        })
    };
};

export { formatToRPCStandard };
