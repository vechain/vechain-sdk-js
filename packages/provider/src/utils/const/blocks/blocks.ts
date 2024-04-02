import { type BlockQuantityInputRPC } from '../../rpc-mapper';
import { Hex0x } from '@vechain/sdk-core';

/**
 * Get the correct block number for the given block number.
 *
 * @param block - The block tag to get. 'latest' or 'earliest' or 'pending' or 'safe' or 'finalized' or an object: { blockNumber: number } or { blockHash: string }
 *
 * @note
 *  * Standard RPC method `eth_getBlockByNumber` support following block numbers: hex number of block, 'earliest', 'latest', 'safe', 'finalized', 'pending'. (@see https://ethereum.org/en/developers/docs/apis/json-rpc#default-block)
 *  * Currently, vechain only supports hex number of block, 'latest' and 'finalized'.
 */
const getCorrectBlockNumberRPCToVechain = (
    block: BlockQuantityInputRPC
): string => {
    // Tag block number
    if (typeof block === 'string') {
        if (block === 'latest') return 'best'; // 'best' is the alias for 'latest' in vechain Thorest
        return block;
    }

    // Object with block number
    if (block.blockNumber !== undefined) {
        return Hex0x.of(block.blockNumber);
    }

    // Object with block hash - Default case
    return block.blockHash;
};

export { getCorrectBlockNumberRPCToVechain };
