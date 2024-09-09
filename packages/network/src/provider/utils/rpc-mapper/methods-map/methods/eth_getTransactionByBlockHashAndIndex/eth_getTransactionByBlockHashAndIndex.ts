import { type ThorClient } from '../../../../../../thor-client';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';
import { type BlocksRPC, type TransactionRPC } from '../../../../formatter';
import { RPCMethodsMap } from '../../../rpc-mapper';
import { RPC_METHODS } from '../../../../const';

/**
 * RPC Method eth_getTransactionByBlockHashAndIndex implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethGetTransactionByBlockHashAndIndex = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TransactionRPC | null> => {
    if (
        params.length !== 2 ||
        typeof params[0] !== 'string' ||
        typeof params[1] !== 'string'
    )
        throw new JSONRPCInvalidParams(
            'eth_getTransactionByBlockHashAndIndex',
            -32602,
            `Invalid input params for "eth_getTransactionByBlockHashAndIndex" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        const [blockHash, index] = params as [string, string];

        // Get the block containing the transactions
        const block = (await RPCMethodsMap(thorClient)[
            RPC_METHODS.eth_getBlockByHash
        ]([blockHash, false])) as BlocksRPC;

        for (let i = 0; i < block.transactions.length; i++) {
            const transaction = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getTransactionByHash
            ]([block.transactions[i]])) as TransactionRPC;
            if (transaction.transactionIndex === index) {
                return transaction;
            }
        }

        return null;
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_getTransactionByBlockHashAndIndex()',
            -32603,
            'Method "eth_getTransactionByBlockHashAndIndex" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetTransactionByBlockHashAndIndex };
