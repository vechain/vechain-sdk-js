import { type ThorClient } from '../../../../../../thor-client';
import {
    assert,
    buildProviderError,
    DATA,
    JSONRPC,
    stringifyData
} from '@vechain/sdk-errors';
import {
    type TransactionReceiptRPC,
    type TransactionRPC
} from '../../../../formatter';
import { ethGetBlockByNumber } from '../eth_getBlockByNumber';
import { ethGetTransactionReceipt } from '../eth_getTransactionReceipt';

/**
 * RPC Method eth_getBlockReceipts implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethGetBlockReceipts = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TransactionReceiptRPC[] | null> => {
    assert(
        'eth_getBlockReceipts',
        params.length === 1 && typeof params[0] === 'string',
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 1.\nThe params should be [blockNumber: string (an hex number) | "latest" | "finalized"]'
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
            block.transactions as TransactionRPC[] | [];

        const transactionReceipts: TransactionReceiptRPC[] = [];

        for (const tx of transactionsIntoTheBlock) {
            const receipt = (await ethGetTransactionReceipt(thorClient, [
                tx.hash
            ])) as TransactionReceiptRPC;
            transactionReceipts.push(receipt);
        }

        return transactionReceipts;
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'ethGetBlockReceipts' failed: Error while getting block receipts ${
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

export { ethGetBlockReceipts };
