import { type ThorClient } from '@vechainfoundation/vechain-sdk-network';
import { blocksFormatter, type BlocksReturnTypeRPC } from '../../formatter';
import {
    buildError,
    getJSONRPCErrorCode,
    JSONRPC
} from '@vechainfoundation/vechain-sdk-errors';

/**
 * All RPC methods related to blocks
 */

/**
 * Returns the block with the given block number.
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters. Params[0] contains The block number.
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
