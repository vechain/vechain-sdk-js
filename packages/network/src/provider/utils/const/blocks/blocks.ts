import { type BlockQuantityInputRPC } from '../../rpc-mapper';
import { _Hex0x } from '@vechain/sdk-core';

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
        if (block === 'earliest') return _Hex0x.of(0);

        // _Hex number of block
        return block;
    }

    // Object with block number
    if (block.blockNumber !== undefined) {
        return _Hex0x.of(block.blockNumber);
    }

    // Object with block hash - Default case
    return block.blockHash;
};

export { getCorrectBlockNumberRPCToVeChain };
