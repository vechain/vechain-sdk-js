import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import {
    type BlocksRPC,
    type TransactionRPC,
    transactionsFormatter
} from '../../../../formatter';
import { RPCMethodsMap } from '../../../rpc-mapper';
import { RPC_METHODS } from '../../../../const';
import { getTransactionIndexIntoBlock } from '../../../../helpers';
import { type ThorClient } from '../../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';

/**
 * RPC Method eth_getTransactionByHash implementation
 *
 * @link [eth_getTransactionByHash](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gettransactionbyhash)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The transaction hash to get as a hex string.
 * @returns the transaction at the given hash formatted to the RPC standard or null if the transaction does not exist.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetTransactionByHash = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TransactionRPC | null> => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'string')
        throw new JSONRPCInvalidParams(
            'eth_getTransactionByHash',
            -32602,
            `Invalid input params for "eth_getTransactionByHash" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        const [hash] = params as [string];

        // Get the VeChainThor transaction
        const tx = await thorClient.transactions.getTransaction(hash);

        if (tx === null) return null;

        // Get the block containing the transaction
        const block = (await RPCMethodsMap(thorClient)[
            RPC_METHODS.eth_getBlockByNumber
        ]([tx.meta.blockID, false])) as BlocksRPC;

        // Get the index of the transaction in the block
        const txIndex = getTransactionIndexIntoBlock(block, hash);
        console.log('txIndex', txIndex);

        // Get the chain id
        const chainId = (await RPCMethodsMap(thorClient)[
            RPC_METHODS.eth_chainId
        ]([])) as string;

        return transactionsFormatter.formatToRPCStandard(tx, chainId, txIndex);
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_getTransactionByHash()',
            -32603,
            'Method "eth_getTransactionByHash" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetTransactionByHash };
