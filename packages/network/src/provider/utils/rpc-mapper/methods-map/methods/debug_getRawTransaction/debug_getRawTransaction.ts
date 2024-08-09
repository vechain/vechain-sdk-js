import { type ThorClient } from '../../../../../../thor-client';
import { FunctionNotImplemented } from '@vechain/sdk-errors';

/**
 * RPC Method debug_getRawTransaction implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
@throws {FunctionNotImplemented}
 */
const debugGetRawTransaction = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw new FunctionNotImplemented(
        'debug_getRawTransaction',
        'Method "debug_getRawTransaction" has not been implemented yet.',
        {
            functionName: 'debug_getRawTransaction',
            thorClient,
            params
        }
    );
};

export { debugGetRawTransaction };
