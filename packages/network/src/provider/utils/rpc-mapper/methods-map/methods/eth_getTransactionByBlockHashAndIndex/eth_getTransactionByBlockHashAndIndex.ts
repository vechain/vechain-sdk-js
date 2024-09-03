import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Method eth_getTransactionByBlockHashAndIndex implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethGetTransactionByBlockHashAndIndex = async (): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    VeChainSDKLogger('warning').log({
        title: 'eth_getTransactionByBlockHashAndIndex',
        messages: [
            'Method "eth_getTransactionByBlockHashAndIndex" has not been implemented yet.'
        ]
    });
};

export { ethGetTransactionByBlockHashAndIndex };
