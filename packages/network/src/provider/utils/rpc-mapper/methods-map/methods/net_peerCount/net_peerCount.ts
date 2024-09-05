import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Method net_peerCount implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const netPeerCount = async (): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    VeChainSDKLogger('warning').log({
        title: 'net_peerCount',
        messages: ['Method "net_peerCount" has not been implemented yet.']
    });
};

export { netPeerCount };
