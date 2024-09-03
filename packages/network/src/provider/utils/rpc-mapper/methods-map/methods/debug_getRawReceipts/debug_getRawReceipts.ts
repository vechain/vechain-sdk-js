import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Method debug_getRawReceipts implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const debugGetRawReceipts = async (): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    VeChainSDKLogger('warning').log({
        title: 'debug_getRawReceipts',
        messages: [
            'Method "debug_getRawReceipts" has not been implemented yet.'
        ]
    });
};

export { debugGetRawReceipts };
