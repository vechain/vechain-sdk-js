import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';
import { type BlocksRPC, type TransactionRPC } from '../../../formatter';
import { ethGetBlockByNumber } from '../eth_getBlockByNumber';
import { ethGetTransactionByHash } from '../eth_getTransactionByHash';

/**
 * RPC Method eth_getTransactionByBlockNumberAndIndex implementation
 *
 * @link [eth_getTransactionByBlockNumberAndIndex](https://ethereum.github.io/execution-apis/api-documentation/)
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
            `Invalid input params for "eth_getTransactionByBlockNumberAndIndex" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        const [blockHash, index] = params as [string, string];

        // Get the block containing the transactions
        const block = (await ethGetBlockByNumber(thorClient, [
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
            'eth_getTransactionByBlockNumberAndIndex()',
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
