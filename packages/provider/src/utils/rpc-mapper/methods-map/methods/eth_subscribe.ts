import { type ThorClient } from '@vechain/vechain-sdk-network';
import {
    type FilterOptions,
    type VechainProvider
} from '../../../../providers';
import { buildError, ERROR_CODES } from '@vechain/vechain-sdk-errors';
import { dataUtils } from '@vechain/vechain-sdk-core';

/**
 * Enumerates the types of subscriptions supported by the`eth_subscribe` RPC method.
 */
enum SUBSCRIPTION_TYPE {
    /**
     * Subscription type for receiving notifications about new blocks added to the blockchain.
     */
    NEW_HEADS = 'newHeads',

    /**
     * Subscription type for receiving log entries that match specific filter criteria,
     * allowing clients to listen for specific events emitted by smart contracts.
     */
    LOGS = 'logs'
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
 * @param thorClient - An instance of `ThorClient` used to interact with the blockchain, such as
 *                     retrieving the current best block when setting up a new subscription.
 * @param params - Parameters for the subscription, conforming to `ethSubscribeParams`. The first
 *                 element of the array specifies the type of subscription, and the second element
 *                 (if present) provides additional options, such as filter criteria for log subscriptions.
 * @param provider - An optional `VechainProvider` instance that contains the subscription manager.
 *                   The subscription manager is used to store and manage active subscriptions.
 *                   If the provider is not provided or is undefined, the function throws an error.
 *
 * @returns A `Promise` that resolves to a string representing the unique ID of the created subscription.
 *
 * @throws An error if the provider is undefined, indicating that the provider is not available,
 *         or if the first parameter in `params` is not a valid subscription type.
 */
const ethSubscribe = async (
    thorClient: ThorClient,
    params: ethSubscribeParams,
    provider?: VechainProvider
): Promise<string> => {
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
    if (
        params[0] !== SUBSCRIPTION_TYPE.NEW_HEADS &&
        params[0] !== SUBSCRIPTION_TYPE.LOGS
    ) {
        throw buildError(
            ERROR_CODES.JSONRPC.INVALID_PARAMS,
            'Invalid subscription type param',
            {
                message: 'Invalid subscription type param',
                code: -32602
            }
        );
    }

    // I check if some subscription is already active, if not I set a new starting block number for the subscription
    if (
        provider.subscriptionManager.logSubscriptions.size === 0 &&
        provider.subscriptionManager.newHeadsSubscription === undefined
    ) {
        const block = await thorClient.blocks.getBestBlock();

        if (block !== undefined && block !== null) {
            provider.subscriptionManager.currentBlockNumber = block.number;
        }
    }
    const subscriptionId = dataUtils.generateRandomHexOfLength(32);

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
            options: params[1] as FilterOptions
        });
    }
    return subscriptionId;
};

export { ethSubscribe };
