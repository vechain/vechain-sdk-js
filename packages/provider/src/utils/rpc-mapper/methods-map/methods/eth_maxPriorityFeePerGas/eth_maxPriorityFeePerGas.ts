import { type ThorClient } from '@vechain/vechain-sdk-network';
import { buildError, FUNCTION } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_maxPriorityFeePerGas implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethMaxPriorityFeePerGas = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        'eth_maxPriorityFeePerGas',
        FUNCTION.NOT_IMPLEMENTED,
        'Method "eth_maxPriorityFeePerGas" not not implemented yet',
        {
            params,
            thorClient
        }
    );
};

export { ethMaxPriorityFeePerGas };
