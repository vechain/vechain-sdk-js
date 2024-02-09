import type { VechainProvider } from '../../../../providers';
import { buildError, ERROR_CODES } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_unsubscribe implementation
 *
 * @param params - The standard array of rpc call parameters.
 * @param provider - The provider instance.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethUnsubscribe = async (
    params: unknown[],
    provider?: VechainProvider
): Promise<boolean> => {
    let result: boolean = false;
    if (provider === undefined) {
        throw buildError(
            ERROR_CODES.JSONRPC.INTERNAL_ERROR,
            'Provider not available',
            {
                message: 'The Provider is not defined',
                code: -32603
            }
        );
    }
    const subscriptionId = params[0] as string;

    if (provider.subscriptionManager.newHeadsSubscription !== undefined) {
        provider.subscriptionManager.newHeadsSubscription = undefined;
        result = true;
    } else {
        provider.subscriptionManager.logSubscriptions.delete(subscriptionId);
        result = true;
    }

    return await Promise.resolve(result);
};

export { ethUnsubscribe };
