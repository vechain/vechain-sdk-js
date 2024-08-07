import { FunctionNotImplemented } from '@vechain/sdk-errors';
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
 * @throws {FunctionNotImplemented}
 */
const debugGetRawBlock = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw new FunctionNotImplemented(
        'debug_getRawBlock',
        'Method "debug_getRawBlock" has not been implemented yet.',
        {
            functionName: 'debug_getRawBlock',
            thorClient,
            params
        }
    );
};

export { debugGetRawBlock };
