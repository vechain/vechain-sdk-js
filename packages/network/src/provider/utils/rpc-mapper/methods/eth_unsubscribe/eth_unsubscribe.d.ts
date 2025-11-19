import type { VeChainProvider } from '../../../../providers/vechain-provider';
/**
 * Asynchronously unsubscribes from a VeChain event subscription.
 * This function attempts to unsubscribe from either 'newHeads' or log subscriptions
 * based on the provided `subscriptionId`. If the provider is not available or the
 * `subscriptionId` does not match any active subscriptions, it may throw an error
 * or return `false`, respectively.
 *
 * @link [eth_unsubscribe](https://docs.infura.io/api/networks/ethereum/json-rpc-methods/subscription-methods/eth_unsubscribe)
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
declare const ethUnsubscribe: (params: unknown[], provider?: VeChainProvider) => Promise<boolean>;
export { ethUnsubscribe };
//# sourceMappingURL=eth_unsubscribe.d.ts.map