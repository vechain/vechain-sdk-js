import {
    assert,
    buildProviderError,
    DATA,
    InvalidDataType,
    JSONRPC,
    stringifyData
} from '@vechain/sdk-errors';
import {
    type TransactionReceiptRPC,
    transactionsFormatter
} from '../../../../formatter';
import { RPC_METHODS } from '../../../../const';
import { RPCMethodsMap } from '../../../rpc-mapper';
import {
    type ExpandedBlockDetail,
    type ThorClient
} from '../../../../../../thor-client';
import { Hex0x } from '@vechain/sdk-core';

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
    // Init the transaction ID
    const [transactionID] = params as [string];

    // Assert valid parameters
    assert(
        'eth_getTransactionReceipt',
        params.length === 1 && typeof params[0] === 'string',
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 1.\nThe params should be [hash: string]'
    );

    // Invalid transaction ID
    if (!Hex0x.isThorId(transactionID)) {
        throw new InvalidDataType(
            'eth_getTransactionReceipt()',
            'Invalid transaction ID given as input. Input must be an hex string of length 64.',
            { transactionID }
        );
    }

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
                await thorClient.transactions.getTransaction(hash);

            // Get the chain id
            const chainId = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_chainId
            ]([])) as string;

            // Initialize the result
            if (transactionDetail !== null)
                return transactionsFormatter.formatTransactionReceiptToRPCStandard(
                    hash,
                    receipt,
                    transactionDetail,
                    blockContainsTransaction,
                    chainId
                );
            else return null;
        } else {
            return null;
        }
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_getTransactionReceipt' failed: Error while getting the transaction receipt ${
                params[0] as string
            }\n
        Params: ${stringifyData(params)}\n
        URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetTransactionReceipt };
