import { type BlockDetail } from '@vechainfoundation/vechain-sdk-network';
import { type BlocksReturnTypeRPC } from './types';
import {
    dataUtils,
    vechain_sdk_core_ethers,
    ZERO_BUFFER
} from '@vechainfoundation/vechain-sdk-core';

/**
 * Output formatter for block details.
 * It converts the block details into the RPC standard.
 *
 * @param block - The block details to be formatted.
 */
const formatToRPCStandard = (block: BlockDetail): BlocksReturnTypeRPC => {
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
        transactions: block.transactions as string[],
        miner: block.signer,

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
        extraData: '0x',
        baseFeePerGas: '0x0'
    };
};

export { formatToRPCStandard };
