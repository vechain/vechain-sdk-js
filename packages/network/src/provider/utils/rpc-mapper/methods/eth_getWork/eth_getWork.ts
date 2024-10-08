import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Method eth_getWork implementation
 *
 * @link [eth_getWork](https://docs.infura.io/api/networks/ethereum/json-rpc-methods/eth_getwork)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethGetWork = async (): Promise<'METHOD NOT IMPLEMENTED'> => {
    // Not implemented yet
    VeChainSDKLogger('warning').log({
        title: 'eth_getWork',
        messages: ['Method "eth_getWork" has not been implemented yet.']
    });

    // To avoid eslint error
    return await Promise.resolve('METHOD NOT IMPLEMENTED');
};

export { ethGetWork };
