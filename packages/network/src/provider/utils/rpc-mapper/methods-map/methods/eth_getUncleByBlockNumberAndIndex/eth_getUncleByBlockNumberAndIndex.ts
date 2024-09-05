import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Method eth_getUncleByBlockNumberAndIndex implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethGetUncleByBlockNumberAndIndex = async (): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    VeChainSDKLogger('warning').log({
        title: 'eth_getUncleByBlockNumberAndIndex',
        messages: [
            'Method "eth_getUncleByBlockNumberAndIndex" has not been implemented yet.'
        ]
    });
};

export { ethGetUncleByBlockNumberAndIndex };
