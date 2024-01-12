import { type ThorClient } from '@vechain/vechain-sdk-network';
import {
    buildError,
    getJSONRPCErrorCode,
    JSONRPC
} from '@vechain/vechain-sdk-errors';
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
        throw buildError(
            JSONRPC.INTERNAL_ERROR,
            `Error while getting block ${blockNumber}`,
            {
                code: getJSONRPCErrorCode(JSONRPC.INTERNAL_ERROR),
                message: JSONRPC.INTERNAL_ERROR.toString()
            }
        );
    }
};

export { ethGetBlockByNumber };
