import { type ThorClient } from '@vechain/vechain-sdk-network';
import { buildProviderError, JSONRPC } from '@vechain/vechain-sdk-errors';
import { blocksFormatter, type BlocksReturnTypeRPC } from '../../../formatter';

/**
 * RPC Method eth_getBlockByNumber implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: The block number to get.
 */
const ethGetBlockByNumber = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<BlocksReturnTypeRPC | null> => {
    // Get the block number
    const blockNumber: string | number = params[0] as string | number;

    try {
        const block = await thorClient.blocks.getBlock(blockNumber);

        return block !== null
            ? blocksFormatter.formatToRPCStandard(block)
            : null;
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_getBlockByNumber' failed: Error while getting block ${blockNumber}\n
            Params: ${JSON.stringify(params)}\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethGetBlockByNumber };
