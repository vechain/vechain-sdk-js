import { type ThorClient } from '../../../../../../thor-client';
import { buildError, FUNCTION } from '@vechain/sdk-errors';

/**
 * RPC Method engine_exchangeTransitionConfigurationV1 implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const engineExchangeTransitionConfigurationV1 = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        'engine_exchangeTransitionConfigurationV1',
        FUNCTION.NOT_IMPLEMENTED,
        'Method "engine_exchangeTransitionConfigurationV1" has not been implemented yet.',
        {
            params,
            thorClient
        }
    );
};

export { engineExchangeTransitionConfigurationV1 };
