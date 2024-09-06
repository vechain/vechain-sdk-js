import { type ThorClient } from '../../../../../../thor-client';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';
import {
    type TransactionRPC,
    transactionsFormatter
} from '../../../../formatter';
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
        const [hash, index] = params as [string, string];

        // Get the VeChainThor transaction
        const tx = await thorClient.transactions.getTransaction(hash, {
            head: index
        });

        if (tx === null) return null;

        // Get the chain id
        const chainId = (await RPCMethodsMap(thorClient)[
            RPC_METHODS.eth_chainId
        ]([])) as string;

        return transactionsFormatter.formatToRPCStandard(
            tx,
            chainId,
            Number(index)
        );
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
