import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';
import { type TransactionRPC, transactionsFormatter } from '../../../formatter';
import { getTransactionIndexIntoBlock } from '../../../helpers';
import { ethChainId } from '../eth_chainId';
import { ethGetBlockByNumber } from '../eth_getBlockByNumber';

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
            `Invalid input params for "eth_getTransactionByHash" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        const [hash] = params as [string];

        // Get the VeChainThor transaction
        const tx = await thorClient.transactions.getTransaction(hash);

        if (tx === null) return null;

        // Get the block containing the transaction
        const block = await ethGetBlockByNumber(thorClient, [
            tx.meta.blockID,
            false
        ]);

        if (block === null) return null;

        // Get the index of the transaction in the block
        const txIndex = getTransactionIndexIntoBlock(block, hash);

        // Get the chain id
        const chainId = await ethChainId(thorClient);

        return transactionsFormatter.formatToRPCStandard(tx, chainId, txIndex);
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_getTransactionByHash()',
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
