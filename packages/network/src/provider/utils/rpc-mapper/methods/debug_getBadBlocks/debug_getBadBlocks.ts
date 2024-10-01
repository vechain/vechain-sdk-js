import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Method debug_getBadBlocks implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const debugGetBadBlocks = async (): Promise<'METHOD NOT IMPLEMENTED'> => {
    // Not implemented yet
    VeChainSDKLogger('warning').log({
        title: 'debug_getBadBlocks',
        messages: ['Method "debug_getBadBlocks" has not been implemented yet.']
    });

    // To avoid eslint error
    return await Promise.resolve('METHOD NOT IMPLEMENTED');
};

export { debugGetBadBlocks };
