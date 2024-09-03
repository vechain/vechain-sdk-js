import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Method parity_nextNonce implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const parityNextNonce = async (): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    VeChainSDKLogger('warning').log({
        title: 'parity_nextNonce',
        messages: ['Method "parity_nextNonce" has not been implemented yet.']
    });
};

export { parityNextNonce };
