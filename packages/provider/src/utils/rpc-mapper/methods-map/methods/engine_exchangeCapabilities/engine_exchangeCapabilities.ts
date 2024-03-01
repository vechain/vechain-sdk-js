import { type ThorClient } from '@vechain/vechain-sdk-network';
import { buildError, FUNCTION } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method engine_exchangeCapabilities implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const engineExchangeCapabilities = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        "engine_exchangeCapabilities",
        FUNCTION.NOT_IMPLEMENTED,
        'Method "engine_exchangeCapabilities" not not implemented yet',
        {
            params,
            thorClient
        }
    );
};

export { engineExchangeCapabilities };
