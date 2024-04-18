import { buildError, FUNCTION } from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../../thor-client';

/**
 * RPC Method debug_getRawHeader implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const debugGetRawHeader = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        'debug_getRawHeader',
        FUNCTION.NOT_IMPLEMENTED,
        'Method "debug_getRawHeader" has not been implemented yet.',
        {
            params,
            thorClient
        }
    );
};

export { debugGetRawHeader };
