import { Hex } from '@vechain/sdk-core';
import { type BlockQuantityInputRPC } from '../../rpc-mapper';

/**
 * Get the correct block number for the given block number.
 *
 * @param block - The block tag to get.
 * 'latest' or 'earliest' or 'pending' or 'safe' or 'finalized'
 * or an object: { blockNumber: number } or { blockHash: string }
 *
 * @note
 *  * Currently VeChainThor supports 'earliest', 'latest' and 'finalized' as block tags.
 *  So 'pending' and 'safe' are converted to 'best' which is the alias for 'latest' and 'finalized' in VeChainThor.
 */
const getCorrectBlockNumberRPCToVeChain = (
    block: BlockQuantityInputRPC
): string => {
    // Tag block number
    if (typeof block === 'string') {
        // Latest, Finalized, Safe blocks
        if (
            block === 'latest' ||
            block === 'finalized' ||
            block === 'safe' ||
            block === 'pending'
        )
            // 'best' is the alias for 'latest', 'finalized' and 'safe' in VeChainThor
            return 'best';

        // Earliest block
        if (block === 'earliest') return Hex.of(0).toString();

        // Hex number of block
        return block;
    }

    // Object with block number
    if (block.blockNumber !== undefined) {
        return Hex.of(block.blockNumber).toString();
    }

    // Object with block hash - Default case
    return block.blockHash;
};

export { getCorrectBlockNumberRPCToVeChain };
