import { buildError, FUNCTION } from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../../thor-client';

/**
 * RPC Method debug_getRawBlock implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const debugGetRawBlock = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        'debug_getRawBlock',
        FUNCTION.NOT_IMPLEMENTED,
        'Method "debug_getRawBlock" has not been implemented yet.',
        {
            params,
            thorClient
        }
    );
};

export { debugGetRawBlock };
