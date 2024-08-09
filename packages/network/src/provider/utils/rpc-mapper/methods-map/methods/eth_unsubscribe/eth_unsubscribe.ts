import type { VeChainProvider } from '../../../../../providers';
import { JSONRPCInternalError, stringifyData } from '@vechain/sdk-errors';

/**
 * Asynchronously unsubscribes from a VeChain event subscription.
 * This function attempts to unsubscribe from either 'newHeads' or log subscriptions
 * based on the provided `subscriptionId`. If the provider is not available or the
 * `subscriptionId` does not match any active subscriptions, it may throw an error
 * or return `false`, respectively.
 *
 * @param params - An array containing the subscription ID as its first element.
 * The subscription ID is used to identify and unsubscribe from the corresponding
 * Ethereum event subscription.
 * @param provider - An optional `VeChainProvider` instance that contains the
 * subscription manager. This manager holds the active subscriptions and is used
 * to unsubscribe from them. If the provider is not provided or is undefined,
 * the function throws an error indicating that the provider is not available.
 * @returns A `Promise` that resolves to `true` if the unsubscription was successful,
 * or `false` if the specified subscription ID does not match any active subscriptions.
 * @throws {JSONRPCInternalError}
 */
const ethUnsubscribe = async (
    params: unknown[],
    provider?: VeChainProvider
): Promise<boolean> => {
    let result: boolean = false;

    if (provider === undefined) {
        throw new JSONRPCInternalError(
            'ethSubscribe()',
            -32603,
            'Method "ethSubscribe" failed. Provider is not defined.',
            {
                params: stringifyData(params)
            }
        );
    }

    const subscriptionId = params[0] as string;

    // Unsubscribe from 'newHeads' events if the subscription ID matches the newHeads subscription
    if (
        provider.subscriptionManager.newHeadsSubscription !== undefined &&
        subscriptionId ===
            provider.subscriptionManager.newHeadsSubscription.subscriptionId
    ) {
        provider.subscriptionManager.newHeadsSubscription = undefined;
        result = true;
    }
    // Unsubscribe from log events if the subscription ID matches a log subscription
    else {
        result =
            provider.subscriptionManager.logSubscriptions.delete(
                subscriptionId
            );
    }

    if (!provider.isThereActiveSubscriptions()) {
        provider.stopSubscriptionsPolling();
    }

    return await Promise.resolve(result);
};

export { ethUnsubscribe };
