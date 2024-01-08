import { type ThorClient } from '@vechainfoundation/vechain-sdk-network';
import { buildError, FUNCTION } from '@vechainfoundation/vechain-sdk-errors';

/**
 * All RPC methods related to transactions
 */

/**
 * Returns the block with the given block number.
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters. Params[0] contains The block number.
 */
const ethGetTransactionByHash = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(FUNCTION.NOT_IMPLEMENTED, 'Not implemented yet', {
        params,
        thorClient
    });
};

export { ethGetTransactionByHash };
