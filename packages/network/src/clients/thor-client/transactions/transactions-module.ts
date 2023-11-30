import {
    type Transaction,
    assertIsSignedTransaction
} from '@vechainfoundation/vechain-sdk-core';
import { Poll, type HttpClient } from '../../../utils';
import {
    type TransactionReceipt,
    TransactionsClient
} from '../../thorest-client';
import { type WaitForTransactionOptions } from './types';

/**
 * The `TransactionsModule` handles transaction related operations and provides
 * convenient methods for sending transactions and waiting for transaction confirmation.
 */
class TransactionsModule {
    /**
     * Reference to the `TransactionsClient` instance.
     */
    private readonly transactionsClient: TransactionsClient;

    /**
     * Initializes a new instance of the `TransactionsModule` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(readonly httpClient: HttpClient) {
        this.transactionsClient = new TransactionsClient(httpClient);
    }

    /**
     * Sends a signed transaction to the network.
     *
     * @param signedTx - the transaction to send. It must be signed.
     *
     * @returns A promise that resolves to the transaction ID of the sent transaction.
     *
     * @throws an error if the transaction is not signed.
     */
    public async sendTransaction(signedTx: Transaction): Promise<string> {
        assertIsSignedTransaction(signedTx);

        const rawTx = `0x${signedTx.encoded.toString('hex')}`;

        const txID = (await this.transactionsClient.sendTransaction(rawTx)).id;

        return txID;
    }

    /**
     * Waits for a transaction to be included in a block.
     *
     * @param txID - The transaction ID of the transaction to wait for.
     * @param options - Optional parameters for the request. Includes the timeout and interval between requests.
     *                  Both parameters are in milliseconds. If the timeout is not specified, the request will not timeout!
     *
     * @returns A promise that resolves to the transaction receipt of the transaction. If the transaction is not included in a block before the timeout,
     *          the promise will resolve to `null`.
     */
    public async waitForTransaction(
        txID: string,
        options?: WaitForTransactionOptions
    ): Promise<TransactionReceipt | null> {
        const result = await Poll.SyncPoll(
            async () =>
                await this.transactionsClient.getTransactionReceipt(txID),
            {
                requestIntervalInMilliseconds: options?.intervalMs,
                maximumWaitingTimeInMilliseconds: options?.timeoutMs
            }
        ).waitUntil((result) => {
            return result !== null;
        });

        return result;
    }
}

export { TransactionsModule };
