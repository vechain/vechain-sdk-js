import type { VechainProvider } from '../../../../providers';
import { buildError, ERROR_CODES } from '@vechain/vechain-sdk-errors';

/**
 * Asynchronously unsubscribes from a vechain event subscription.
 * This function attempts to unsubscribe from either 'newHeads' or log subscriptions
 * based on the provided `subscriptionId`. If the provider is not available or the
 * `subscriptionId` does not match any active subscriptions, it may throw an error
 * or return `false`, respectively.
 *
 * @param params - An array containing the subscription ID as its first element.
 * The subscription ID is used to identify and unsubscribe from the corresponding
 * Ethereum event subscription.
 * @param provider - An optional `VechainProvider` instance that contains the
 * subscription manager. This manager holds the active subscriptions and is used
 * to unsubscribe from them. If the provider is not provided or is undefined,
 * the function throws an error indicating that the provider is not available.
 *
 * @returns A `Promise` that resolves to `true` if the unsubscription was successful,
 * or `false` if the specified subscription ID does not match any active subscriptions.
 *
 * @throws An error with a JSON-RPC internal error code (-32603) if the provider is
 * not available. The error includes a message indicating that the provider is
 * not defined.
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

    return await Promise.resolve(result);
};

export { ethUnsubscribe };
