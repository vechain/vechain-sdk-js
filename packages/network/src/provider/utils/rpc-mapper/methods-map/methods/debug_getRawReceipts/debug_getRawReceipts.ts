import { FunctionNotImplemented } from '@vechain/sdk-errors';
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
 * @throws {FunctionNotImplemented}
 */
const debugGetRawReceipts = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw new FunctionNotImplemented(
        'debug_getRawReceipts',
        'Method "debug_getRawReceipts" has not been implemented yet.',
        {
            functionName: 'debug_getRawReceipts',
            thorClient,
            params
        }
    );
};

export { debugGetRawReceipts };
