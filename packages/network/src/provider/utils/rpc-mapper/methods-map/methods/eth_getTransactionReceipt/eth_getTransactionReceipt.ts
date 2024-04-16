import { assert, buildProviderError, DATA, JSONRPC } from '@vechain/sdk-errors';
import {
    type TransactionReceiptRPC,
    transactionsFormatter
} from '../../../../formatter';
import { RPC_METHODS } from '../../../../const';
import { RPCMethodsMap } from '../../../rpc-mapper';
import { assertValidTransactionID } from '@vechain/sdk-core';
import {
    type ExpandedBlockDetail,
    type ThorClient,
    type TransactionDetailNoRaw
} from '../../../../../../thor-client';

/**
 * RPC Method eth_getTransactionReceipt implementation
 *
 * @param thorClient - The thor client instance to use.
 *
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The transaction hash to get as a hex string.
 *
 * @throws {ProviderRpcError} - Will throw an error if the retrieval of the transaction fails.
 */
const ethGetTransactionReceipt = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TransactionReceiptRPC | null> => {
    // Assert valid parameters
    assert(
        'eth_getTransactionReceipt',
        params.length === 1 && typeof params[0] === 'string',
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 1.\nThe params should be [hash: string]'
    );

    // Assert valid transaction id
    assertValidTransactionID('eth_getTransactionReceipt', params[0] as string);

    try {
        // Get hash by params
        const [hash] = params as [string];

        // Get transaction receipt
        const receipt =
            await thorClient.transactions.getTransactionReceipt(hash);

        // Receipt is not null (transaction exists. This implies: Block exists and Transaction details exists)
        if (receipt !== null) {
            // Get the block containing the transaction. @note: It cannot be null!. If some error occurs, it will be thrown.
            const blockContainsTransaction =
                (await thorClient.blocks.getBlockExpanded(
                    receipt.meta.blockID
                )) as ExpandedBlockDetail;

            // Get transaction detail. @note: It cannot be null!. If some error occurs, it will be thrown.
            const transactionDetail =
                (await thorClient.transactions.getTransaction(hash, {
                    raw: false
                })) as TransactionDetailNoRaw;

            // Get the chain id
            const chainId = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_chainId
            ]([])) as string;

            // Initialize the result
            return transactionsFormatter.formatTransactionReceiptToRPCStandard(
                hash,
                receipt,
                transactionDetail,
                blockContainsTransaction,
                chainId
            );
        } else {
            return null;
        }
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_getTransactionReceipt' failed: Error while getting the transaction receipt ${
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

export { ethGetTransactionReceipt };
