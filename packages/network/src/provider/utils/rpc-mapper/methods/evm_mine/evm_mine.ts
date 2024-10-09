import { JSONRPCInternalError, stringifyData } from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../thor-client';
import { blocksFormatter, type BlocksRPC } from '../../../formatter';
import { ethChainId } from '../eth_chainId';

/**
 * RPC Method evm_mine implementation
 *
 * @link [evm_mine](https://hardhat.org/hardhat-network/docs/explanation/mining-modes)
 *
 * @param thorClient - The thor client instance to use.
 * @returns The new block or null if the block is not available.
 * @throws {JSONRPCInternalError}
 */
const evmMine = async (thorClient: ThorClient): Promise<BlocksRPC | null> => {
    try {
        // Get best block
        const bestBlock = await thorClient.blocks.getBestBlockExpanded();
        const newBlock =
            bestBlock !== null
                ? await thorClient.blocks.waitForBlockCompressed(
                      bestBlock.number + 1
                  )
                : null;

        const chainId = await ethChainId(thorClient);

        return newBlock !== null
            ? blocksFormatter.formatToRPCStandard(newBlock, chainId)
            : null;
    } catch (e) {
        throw new JSONRPCInternalError(
            'evm_mine()',
            'Method "evm_mine" failed.',
            {
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { evmMine };
