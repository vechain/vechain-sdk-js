import { buildError, FUNCTION } from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../../thor-client';

/**
 * RPC Method debug_getRawReceipts implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const debugGetRawReceipts = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        'debug_getRawReceipts',
        FUNCTION.NOT_IMPLEMENTED,
        'Method "debug_getRawReceipts" has not been implemented yet.',
        {
            params,
            thorClient
        }
    );
};

export { debugGetRawReceipts };
