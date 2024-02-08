import { type ThorClient } from '@vechain/vechain-sdk-network';
import {
    type FilterOptions,
    type VechainProvider
} from '../../../../providers';
import { subscriptionHelper } from '../../../helpers';
enum SUBSCRIPTION_TYPE {
    NEW_HEADS = 'newHeads',
    LOGS = 'logs'
}

type ethSubscribeParams = [SUBSCRIPTION_TYPE, string | string[]] | unknown[];

/**
 * RPC Method eth_subscribe implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @param provider
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethSubscribe = async (
    thorClient: ThorClient,
    params: ethSubscribeParams,
    provider?: VechainProvider
): Promise<string> => {
    if (provider === undefined) {
        throw new Error('Provider is not defined');
    }
    if (
        params[0] !== SUBSCRIPTION_TYPE.NEW_HEADS &&
        params[0] !== SUBSCRIPTION_TYPE.LOGS
    ) {
        throw new Error('Invalid subscription type');
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
    const subscriptionId = subscriptionHelper.generateRandomHex(32);

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
