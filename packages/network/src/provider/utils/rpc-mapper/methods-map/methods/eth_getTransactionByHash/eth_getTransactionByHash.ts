import { assert, buildProviderError, DATA, JSONRPC } from '@vechain/sdk-errors';
import {
    type BlocksRPC,
    type TransactionRPC,
    transactionsFormatter
} from '../../../../formatter';
import { RPCMethodsMap } from '../../../rpc-mapper';
import { RPC_METHODS } from '../../../../const';
import { getTransactionIndexIntoBlock } from '../../../../helpers';
import {
    type ThorClient,
    type TransactionDetailNoRaw
} from '../../../../../../thor-client';

/**
 * RPC Method eth_getTransactionByHash implementation
 *
 * @link [eth_getTransactionByHash](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gettransactionbyhash)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The transaction hash to get as a hex string.
 *
 * @returns the transaction at the given hash formatted to the RPC standard or null if the transaction does not exist.
 *
 * @throws {ProviderRpcError} - Will throw an error if the retrieval of the transaction fails.
 */
const ethGetTransactionByHash = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TransactionRPC | null> => {
    assert(
        'eth_getTransactionByHash',
        params.length === 1 && typeof params[0] === 'string',
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 1.\nThe params should be [hash: string]'
    );

    try {
        const [hash] = params as [string];

        // Get the VechainThor transaction
        const tx = (await thorClient.transactions.getTransaction(
            hash
        )) as TransactionDetailNoRaw | null;

        if (tx === null) return null;

        // Get the block containing the transaction
        const block = (await RPCMethodsMap(thorClient)[
            RPC_METHODS.eth_getBlockByNumber
        ]([tx.meta.blockID, false])) as BlocksRPC;

        // Get the index of the transaction in the block
        const txIndex = getTransactionIndexIntoBlock(block, hash);

        // Get the chain id
        const chainId = (await RPCMethodsMap(thorClient)[
            RPC_METHODS.eth_chainId
        ]([])) as string;

        return transactionsFormatter.formatToRPCStandard(tx, chainId, txIndex);
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_getTransactionByHash' failed: Error while getting the transaction ${
                params[0] as string
            }\n
        Params: ${JSON.stringify(params)}\n
        URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethGetTransactionByHash };
