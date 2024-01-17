import { DATA, assert } from '@vechain/vechain-sdk-errors';
import { randomBytes } from 'crypto';

// type EthSubscribeParams = [
//     subName: 'newHeads' | 'logs' | 'newPendingTransactions',
//     options?: {
//         topics: string[];
//         address?: string | string[];
//     }
// ];

/**
 * RPC Method eth_subscribe implementation
 *
 * @link [eth_subscribe](https://docs.infura.io/networks/ethereum/json-rpc-methods/subscription-methods/eth_subscribe)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - TBD
 *
 * @returns The ID of the newly created subscription on the node.
 */
const ethSubscribe = async (params: unknown[]): Promise<string> => {
    // Input validation - Invalid params TO BE UPDATED
    assert(
        params.length === 1 && typeof params[0] === 'string',
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 1.\nThe params should be [param: string]'
    );
    // also missing asserts at the beginning
    // @TODO: should do something like this.subscription[subscriptionId] = params
    const subscriptionId = '0x' + randomBytes(16).toString('hex');
    return await Promise.resolve(subscriptionId);
};

export { ethSubscribe };
