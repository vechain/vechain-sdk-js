import { type ThorClient } from '../../../../../../thor-client';
import { FunctionNotImplemented } from '@vechain/sdk-errors';

/**
 * RPC Method eth_getUncleByBlockHashAndIndex implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 * @throws {FunctionNotImplemented}
 */
const ethGetUncleByBlockHashAndIndex = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw new FunctionNotImplemented(
        'eth_getUncleByBlockHashAndIndex',
        'Method "eth_getUncleByBlockHashAndIndex" has not been implemented yet.',
        {
            functionName: 'eth_getUncleByBlockHashAndIndex',
            thorClient,
            params
        }
    );
};

export { ethGetUncleByBlockHashAndIndex };
