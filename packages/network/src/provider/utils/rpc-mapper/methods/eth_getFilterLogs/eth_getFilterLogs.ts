import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Method eth_getFilterLogs implementation
 *
 * @link [eth_getFilterLogs](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethGetFilterLogs = async (): Promise<'METHOD NOT IMPLEMENTED'> => {
    // Not implemented yet
    VeChainSDKLogger('warning').log({
        title: 'eth_getFilterLogs',
        messages: ['Method "eth_getFilterLogs" has not been implemented yet.']
    });

    // To avoid eslint error
    return await Promise.resolve('METHOD NOT IMPLEMENTED');
};

export { ethGetFilterLogs };
