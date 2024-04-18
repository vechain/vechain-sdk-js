import { type ThorClient } from '../../../../../../thor-client';
import { buildError, FUNCTION } from '@vechain/sdk-errors';

/**
 * RPC Method engine_forkchoiceUpdatedV2 implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const engineForkchoiceUpdatedV2 = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        'engine_forkchoiceUpdatedV2',
        FUNCTION.NOT_IMPLEMENTED,
        'Method "engine_forkchoiceUpdatedV2" has not been implemented yet.',
        {
            params,
            thorClient
        }
    );
};

export { engineForkchoiceUpdatedV2 };
