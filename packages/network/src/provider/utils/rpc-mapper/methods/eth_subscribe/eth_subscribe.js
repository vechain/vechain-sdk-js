"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethSubscribe = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Enumerates the types of subscriptions supported by the`eth_subscribe` RPC method.
 */
var SUBSCRIPTION_TYPE;
(function (SUBSCRIPTION_TYPE) {
    /**
     * Subscription type for receiving notifications about new blocks added to the blockchain.
     */
    SUBSCRIPTION_TYPE["NEW_HEADS"] = "newHeads";
    /**
     * Subscription type for receiving log entries that match specific filter criteria,
     * allowing clients to listen for specific events emitted by smart contracts.
     */
    SUBSCRIPTION_TYPE["LOGS"] = "logs";
})(SUBSCRIPTION_TYPE || (SUBSCRIPTION_TYPE = {}));
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
const ethSubscribe = async (thorClient, params, provider) => {
    if (provider === undefined) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_subscribe()', 'Method "eth_subscribe" failed. Provider is not defined.', {
            url: thorClient.httpClient.baseURL,
            params: (0, sdk_errors_1.stringifyData)(params)
        });
    }
    if (params[0] !== SUBSCRIPTION_TYPE.NEW_HEADS &&
        params[0] !== SUBSCRIPTION_TYPE.LOGS) {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_subscribe()', 'Method "eth_subscribe" failed. Invalid subscription type param.', {
            url: thorClient.httpClient.baseURL,
            params: (0, sdk_errors_1.stringifyData)(params)
        });
    }
    // I check if a poll instance is already active, if not I set a new starting block number for the subscription
    if (provider.getPollInstance() === undefined) {
        const block = await thorClient.blocks.getBestBlockCompressed();
        if (block !== undefined && block !== null) {
            provider.subscriptionManager.currentBlockNumber = block.number;
        }
        else
            throw new sdk_errors_1.JSONRPCServerError('eth_subscribe()', 'Method "eth_subscribe" failed. Best block not available.', {
                url: thorClient.httpClient.baseURL,
                params: (0, sdk_errors_1.stringifyData)(params)
            });
        provider.startSubscriptionsPolling();
    }
    const subscriptionId = sdk_core_1.Hex.random(16).digits;
    if (params.includes(SUBSCRIPTION_TYPE.NEW_HEADS)) {
        provider.subscriptionManager.newHeadsSubscription = {
            subscriptionId,
            subscription: {
                type: SUBSCRIPTION_TYPE.NEW_HEADS
            }
        };
    }
    if (params.includes(SUBSCRIPTION_TYPE.LOGS)) {
        provider.subscriptionManager.logSubscriptions.set(subscriptionId, {
            type: SUBSCRIPTION_TYPE.LOGS,
            options: params[1]
        });
    }
    return subscriptionId;
};
exports.ethSubscribe = ethSubscribe;
