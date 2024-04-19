import { type ThorClient } from '../../../../../../thor-client';
import { buildError, FUNCTION } from '@vechain/sdk-errors';

/**
 * RPC Method eth_getBlockTransactionCountByNumber implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethGetBlockTransactionCountByNumber = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        'eth_getBlockTransactionCountByNumber',
        FUNCTION.NOT_IMPLEMENTED,
        'Method "eth_getBlockTransactionCountByNumber" has not been implemented yet.',
        {
            params,
            thorClient
        }
    );
};

export { ethGetBlockTransactionCountByNumber };
