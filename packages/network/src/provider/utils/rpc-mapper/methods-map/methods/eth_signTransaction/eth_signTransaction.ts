import { type ThorClient } from '../../../../../../thor-client';
import { FunctionNotImplemented } from '@vechain/sdk-errors';

/**
 * RPC Method eth_signTransaction implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
@throws {FunctionNotImplemented}
 */
const ethSignTransaction = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw new FunctionNotImplemented(
        'eth_signTransaction',
        'Method "eth_signTransaction" has not been implemented yet.',
        {
            functionName: 'eth_signTransaction',
            thorClient,
            params
        }
    );
};

export { ethSignTransaction };
