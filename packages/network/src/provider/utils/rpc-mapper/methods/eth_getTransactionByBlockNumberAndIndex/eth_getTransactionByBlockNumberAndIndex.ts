import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';
import { RPC_METHODS } from '../../../const';
import { type BlocksRPC, type TransactionRPC } from '../../../formatter';
import { RPCMethodsMap } from '../../../rpc-mapper/rpc-mapper';

/**
 * RPC Method eth_getTransactionByBlockNumberAndIndex implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: block parameter, a hexadecimal block number (or best, latest, finalized).
 * * params[1]: transaction index position, a hexadecimal of the integer representing the position in the block.
 * @returns A transaction object, or null when no transaction was found.
 */
const ethGetTransactionByBlockNumberAndIndex = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TransactionRPC | null> => {
    if (
        params.length !== 2 ||
        typeof params[0] !== 'string' ||
        typeof params[1] !== 'string'
    )
        throw new JSONRPCInvalidParams(
            'eth_getTransactionByBlockNumberAndIndex',
            -32602,
            `Invalid input params for "eth_getTransactionByBlockNumberAndIndex" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        const [blockHash, index] = params as [string, string];

        // Get the block containing the transactions
        const block = (await RPCMethodsMap(thorClient)[
            RPC_METHODS.eth_getBlockByNumber
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
            'eth_getTransactionByBlockNumberAndIndex()',
            -32603,
            'Method "eth_getTransactionByBlockNumberAndIndex" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetTransactionByBlockNumberAndIndex };
