import { type BlockQuantityInputRPC } from '../../rpc-mapper';
import { Hex0x } from '@vechain/sdk-core';

/**
 * Get the correct block number for the given block number.
 *
 * @param block - The block tag to get.
 * 'latest' or 'earliest' or 'pending' or 'safe' or 'finalized'
 * or an object: { blockNumber: number } or { blockHash: string }
 *
 * @note
 *  * Currently VechainThor supports 'earliest', 'latest' and 'finalized' as block tags.
 *  So 'pending' and 'safe' are converted to 'best' which is the alias for 'latest' and 'finalized' in VechainThor.
 */
const getCorrectBlockNumberRPCToVechain = (
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
            // 'best' is the alias for 'latest', 'finalized' and 'safe' in vechain Thorest
            return 'best';

        // Earliest block
        if (block === 'earliest') return Hex0x.of(0);

        // Hex number of block
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
