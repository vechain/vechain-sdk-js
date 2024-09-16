import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Method engine_getPayloadBodiesByHashV1 implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const engineGetPayloadBodiesByHashV1 =
    async (): Promise<'METHOD NOT IMPLEMENTED'> => {
        // Not implemented yet
        VeChainSDKLogger('warning').log({
            title: 'engine_getPayloadBodiesByHashV1',
            messages: [
                'Method "engine_getPayloadBodiesByHashV1" has not been implemented yet.'
            ]
        });

        // To avoid eslint error
        return await Promise.resolve('METHOD NOT IMPLEMENTED');
    };

export { engineGetPayloadBodiesByHashV1 };
