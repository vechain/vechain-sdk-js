import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Method engine_newPayloadV2 implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const engineNewPayloadV2 = async (): Promise<'METHOD NOT IMPLEMENTED'> => {
    // Not implemented yet
    VeChainSDKLogger('warning').log({
        title: 'engine_newPayloadV2',
        messages: ['Method "engine_newPayloadV2" has not been implemented yet.']
    });

    // To avoid eslint error
    return await Promise.resolve('METHOD NOT IMPLEMENTED');
};

export { engineNewPayloadV2 };
