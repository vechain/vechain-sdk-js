import { type ThorClient } from '@vechain/vechain-sdk-network';
import { buildError, FUNCTION } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_getBlockByNumber implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethGetBlockByNumber = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        FUNCTION.NOT_IMPLEMENTED,
        'Method "eth_getBlockByNumber" not not implemented yet',
        {
            params,
            thorClient
        }
    );
};

export { ethGetBlockByNumber };
