import {
    InvalidDataType,
    JSONRPCInternalError,
    JSONRPCInvalidParams,
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
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';

/**
 * RPC Method eth_getTransactionReceipt implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The transaction hash to get as a hex string.
 * @throws {JSONRPCInvalidParams, InvalidDataType, JSONRPCInternalError}
 */
const ethGetTransactionReceipt = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TransactionReceiptRPC | null> => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'string')
        throw new JSONRPCInvalidParams(
            'eth_getTransactionReceipt',
            -32602,
            `Invalid input params for "eth_getTransactionReceipt" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    // Init the transaction ID
    const [transactionID] = params as [string];

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
        throw new JSONRPCInternalError(
            'eth_getTransactionReceipt()',
            -32603,
            'Method "eth_getTransactionReceipt" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetTransactionReceipt };
