import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';
import { type BlocksRPC, type TransactionRPC } from '../../../formatter';
import { ethGetBlockByHash } from '../eth_getBlockByHash';
import { ethGetTransactionByHash } from '../eth_getTransactionByHash';

/**
 * RPC Method eth_getTransactionByBlockHashAndIndex implementation
 *
 * @link [eth_getTransactionByBlockHashAndIndex](https://ethereum.github.io/execution-apis/api-documentation/)
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
            `Invalid input params for "eth_getTransactionByBlockHashAndIndex" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        const [blockHash, index] = params as [string, string];

        // Get the block containing the transactions
        const block = (await ethGetBlockByHash(thorClient, [
            blockHash,
            false
        ])) as BlocksRPC;

        for (const transactionHash of block.transactions) {
            const transaction = (await ethGetTransactionByHash(thorClient, [
                transactionHash
            ])) as TransactionRPC;
            if (transaction.transactionIndex === index) {
                return transaction;
            }
        }

        return null;
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_getTransactionByBlockHashAndIndex()',
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
