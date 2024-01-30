import {
    type BlockDetail,
    type ThorClient
} from '@vechain/vechain-sdk-network';

/**
 * RPC Method evm_mine implementation
 *
 * @link [evm_mine](https://hardhat.org/hardhat-network/docs/explanation/mining-modes)
 *
 * @param thorClient - The thor client instance to use.
 *
 * @returns The new block or null if the block is not available.
 */
const evmMine = async (thorClient: ThorClient): Promise<BlockDetail | null> => {
    const bestBlock = await thorClient.blocks.getBestBlock();
    let newBlock = null;
    if (bestBlock != null) {
        newBlock = await thorClient.blocks.waitForBlock(bestBlock.number + 1);
    }
    return newBlock;
};

export { evmMine };
