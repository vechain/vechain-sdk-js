import { type ThorClient } from '../../../../../../thor-client';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import {
    type TransactionReceiptRPC,
    type TransactionRPC
} from '../../../../formatter';
import { ethGetBlockByNumber } from '../eth_getBlockByNumber';
import { ethGetTransactionReceipt } from '../eth_getTransactionReceipt';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';

/**
 * RPC Method eth_getBlockReceipts implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: blockNumber - The block number to get the receipts for as a hex string or "latest".
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetBlockReceipts = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TransactionReceiptRPC[] | null> => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'string')
        throw new JSONRPCInvalidParams(
            'eth_getBlockReceipts',
            -32602,
            `Invalid input params for "eth_getBlockReceipts" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        // Initialize the block number from the params
        const [blockNumber] = params as [string];

        // Get the block by number
        const block = await ethGetBlockByNumber(thorClient, [
            blockNumber,
            true
        ]);

        // Return the block receipts

        // Block is null, return null
        if (block === null) return null;

        // Block is not null, return the block receipts
        const transactionsIntoTheBlock: TransactionRPC[] =
            block.transactions as TransactionRPC[];

        const transactionReceipts: TransactionReceiptRPC[] = [];

        for (const tx of transactionsIntoTheBlock) {
            const receipt = (await ethGetTransactionReceipt(thorClient, [
                tx.hash
            ])) as TransactionReceiptRPC;

            transactionReceipts.push(receipt);
        }

        return transactionReceipts;
    } catch (e) {
        throw new JSONRPCInternalError(
            'ethGetBlockReceipts()',
            -32603,
            'Method "ethGetBlockReceipts" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetBlockReceipts };
