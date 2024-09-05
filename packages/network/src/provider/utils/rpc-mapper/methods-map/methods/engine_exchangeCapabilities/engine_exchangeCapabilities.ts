import { VeChainSDKLogger } from '@vechain/sdk-logging';
/**
 * RPC Method engine_exchangeCapabilities implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const engineExchangeCapabilities = async (): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    VeChainSDKLogger('warning').log({
        title: 'engine_exchangeCapabilities',
        messages: [
            'Method "engine_exchangeCapabilities" has not been implemented yet.'
        ]
    });
};

export { engineExchangeCapabilities };
