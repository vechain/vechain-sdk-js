import { type ThorClient } from '@vechain/vechain-sdk-network';
import { buildError, FUNCTION } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method engine_getPayloadBodiesByRangeV1 implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const engineGetPayloadBodiesByRangeV1 = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        "engine_getPayloadBodiesByRangeV1",
        FUNCTION.NOT_IMPLEMENTED,
        'Method "engine_getPayloadBodiesByRangeV1" not not implemented yet',
        {
            params,
            thorClient
        }
    );
};

export { engineGetPayloadBodiesByRangeV1 };
