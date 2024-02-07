import { type ThorClient } from '@vechain/vechain-sdk-network';
import {
    type FilterOptions,
    type VechainProvider
} from '../../../../providers';
enum SUBSCRIPTION_TYPE {
    NEW_HEADS = 'newHeads',
    LOGS = 'logs',
    NEW_PENDING_TRANSACTIONS = 'newPendingTransactions',
    SYNCING = 'syncing'
}

type ethSubscribeParams =
    | [
          'newHeads' | 'logs' | 'newPendingTransactions' | 'syncing',
          string | string[]
      ]
    | unknown[];

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
): Promise<void> => {
    if (provider === undefined) {
        throw new Error('Provider is not defined');
    }
    // I check if some subscription is already active, if not I set a new starting point for the subscription
    if (provider.subscriptionManager.subscriptions.size > 0) {
        const block = await thorClient.blocks.getBlock(
            provider.subscriptionManager.currentBlockNumber
        );

        if (block !== undefined && block !== null) {
            provider.subscriptionManager.currentBlockNumber = block.number;
        }
    }

    if (params.includes(SUBSCRIPTION_TYPE.NEW_HEADS)) {
        provider.subscriptionManager.subscriptions.set('newHeads', undefined);
    }

    if (params.includes(SUBSCRIPTION_TYPE.LOGS)) {
        provider.subscriptionManager.subscriptions.set(
            'logs',
            params[1] as FilterOptions
        );
    }

    await Promise.resolve(0);
};

export { ethSubscribe };
