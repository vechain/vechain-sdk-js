import { type ThorClient } from '../../../../../../thor-client';
import { buildError, FUNCTION } from '@vechain/sdk-errors';

/**
 * RPC Method parity_nextNonce implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const parityNextNonce = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        'parity_nextNonce',
        FUNCTION.NOT_IMPLEMENTED,
        'Method "parity_nextNonce" has not been implemented yet.',
        {
            params,
            thorClient
        }
    );
};

export { parityNextNonce };
