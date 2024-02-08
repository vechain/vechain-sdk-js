import type { VechainProvider } from '../../../../providers';

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
): Promise<void> => {
    if (provider === undefined) {
        throw new Error('Provider is not defined');
    }

    const subscriptionId = params[0] as string;

    if (
        provider.subscriptionManager.newHeadsSubscription?.[subscriptionId] !==
        undefined
    ) {
        provider.subscriptionManager.newHeadsSubscription = undefined;
    } else {
        provider.subscriptionManager.logSubscriptions.delete(subscriptionId);
    }

    await Promise.resolve();
};

export { ethUnsubscribe };
