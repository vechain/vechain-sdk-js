import { type ThorClient } from '../../../../../thor-client';
import { type VeChainProvider } from '../../../../providers/vechain-provider';
/**
 * Enumerates the types of subscriptions supported by the`eth_subscribe` RPC method.
 */
declare enum SUBSCRIPTION_TYPE {
    /**
     * Subscription type for receiving notifications about new blocks added to the blockchain.
     */
    NEW_HEADS = "newHeads",
    /**
     * Subscription type for receiving log entries that match specific filter criteria,
     * allowing clients to listen for specific events emitted by smart contracts.
     */
    LOGS = "logs"
}
/**
 * Defines the parameter types accepted by the `eth_subscribe` RPC method.
 */
type ethSubscribeParams = [SUBSCRIPTION_TYPE, string | string[]] | unknown[];
/**
 * Initiates a subscription to the blockchain events based on the specified parameters.
 * This function supports subscriptions to new block headers ('newHeads') and log entries ('logs')
 * that match given filter criteria. It ensures that the provided parameters are valid and that
 * the provider is available before setting up the subscription and generating a unique subscription ID.
 *
 * @link [eth_subscribe](https://docs.infura.io/api/networks/ethereum/json-rpc-methods/subscription-methods/eth_subscribe)
 *
 * @param thorClient - An instance of `ThorClient` used to interact with the blockchain, such as
 *                     retrieving the current best block when setting up a new subscription.
 * @param params - Parameters for the subscription, conforming to `ethSubscribeParams`. The first
 *                 element of the array specifies the type of subscription, and the second element
 *                 (if present) provides additional options, such as filter criteria for log subscriptions.
 * @param provider - An optional `VeChainProvider` instance that contains the subscription manager.
 *                   The subscription manager is used to store and manage active subscriptions.
 *                   If the provider is not provided or is undefined, the function throws an error.
 *
 * @returns A `Promise` that resolves to a string representing the unique ID of the created subscription.
 * @throws {JSONRPCInternalError, JSONRPCInvalidParams, JSONRPCServerError}
 */
declare const ethSubscribe: (thorClient: ThorClient, params: ethSubscribeParams, provider?: VeChainProvider) => Promise<string>;
export { ethSubscribe };
//# sourceMappingURL=eth_subscribe.d.ts.map