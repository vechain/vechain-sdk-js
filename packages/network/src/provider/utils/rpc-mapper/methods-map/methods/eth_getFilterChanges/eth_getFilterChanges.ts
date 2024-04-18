import { type ThorClient } from '../../../../../../thor-client';
import { buildError, FUNCTION } from '@vechain/sdk-errors';

/**
 * RPC Method eth_getFilterChanges implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethGetFilterChanges = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        'eth_getFilterChanges',
        FUNCTION.NOT_IMPLEMENTED,
        'Method "eth_getFilterChanges" has not been implemented yet.',
        {
            params,
            thorClient
        }
    );
};

export { ethGetFilterChanges };
