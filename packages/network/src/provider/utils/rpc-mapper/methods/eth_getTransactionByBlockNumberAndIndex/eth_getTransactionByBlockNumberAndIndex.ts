import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';
import { type TransactionRPC } from '../../../formatter';
import { ethGetBlockByNumber } from '../eth_getBlockByNumber';
import { ethGetTransactionByHash } from '../eth_getTransactionByHash';

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
        const block = await ethGetBlockByNumber(thorClient, [blockHash, false]);

        if (block === null) return null;

        for (let i = 0; i < block.transactions.length; i++) {
            const transaction = await ethGetTransactionByHash(thorClient, [
                block.transactions[i]
            ]);
            if (transaction != null && transaction.transactionIndex === index) {
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
