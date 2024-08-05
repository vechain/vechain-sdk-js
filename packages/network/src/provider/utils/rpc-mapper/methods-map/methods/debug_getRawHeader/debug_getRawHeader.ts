import { FunctionNotImplemented } from '@vechain/sdk-errors';
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
 * @throws {FunctionNotImplemented}
 */
const debugGetRawHeader = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw new FunctionNotImplemented(
        'debug_getRawHeader',
        'Method "debug_getRawHeader" has not been implemented yet.',
        {
            functionName: 'debug_getRawHeader',
            thorClient,
            params
        }
    );
};

export { debugGetRawHeader };
