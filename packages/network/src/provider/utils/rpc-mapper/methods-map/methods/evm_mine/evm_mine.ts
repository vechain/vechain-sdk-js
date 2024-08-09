import { type ThorClient } from '../../../../../../thor-client';
import { blocksFormatter, type BlocksRPC } from '../../../../formatter';
import { JSONRPCInternalError, stringifyData } from '@vechain/sdk-errors';
import { RPCMethodsMap } from '../../../rpc-mapper';
import { RPC_METHODS } from '../../../../const';

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

        const chainId = (await RPCMethodsMap(thorClient)[
            RPC_METHODS.eth_chainId
        ]([])) as string;

        return newBlock !== null
            ? blocksFormatter.formatToRPCStandard(newBlock, chainId)
            : null;
    } catch (e) {
        throw new JSONRPCInternalError(
            'evm_mine()',
            -32603,
            'Method "evm_mine" failed.',
            {
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { evmMine };
