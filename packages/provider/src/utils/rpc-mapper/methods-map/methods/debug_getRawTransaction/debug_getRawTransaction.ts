import { type ThorClient } from '@vechain/vechain-sdk-network';
import { buildError, FUNCTION } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method debug_getRawTransaction implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const debugGetRawTransaction = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        'debug_getRawTransaction',
        FUNCTION.NOT_IMPLEMENTED,
        'Method "debug_getRawTransaction" not not implemented yet',
        {
            params,
            thorClient
        }
    );
};

export { debugGetRawTransaction };
