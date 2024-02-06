import { type ThorClient } from '@vechain/vechain-sdk-network';
import { subscriptionService } from '../../../service/subscriptionService';

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
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethSubscribe = async (
    thorClient: ThorClient,
    params: ethSubscribeParams
): Promise<void> => {
    if (params[0] === SUBSCRIPTION_TYPE.NEW_HEADS) {
        const bestBlock = await thorClient.blocks.getBlock('best');
        if (bestBlock == null) {
            throw new Error('Failed to get the best block');
        }
        subscriptionService.currentBlockNumber = bestBlock.number;
        subscriptionService.subscriptions.push(params[0] as string);
    }

    await Promise.resolve(0);
};

export { ethSubscribe };
