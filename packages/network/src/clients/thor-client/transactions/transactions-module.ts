import {
    type Transaction,
    assertIsSignedTransaction
} from '@vechainfoundation/vechain-sdk-core';
import { Poll } from '../../../utils';
import {
    type ThorestClient,
    type TransactionReceipt,
    type TransactionSimulationResult
} from '../../thorest-client';
import type { SendTransactionResult, WaitForTransactionOptions } from './types';
import { decodeRevertReason } from './helpers/message';

/**
 * The `TransactionsModule` handles transaction related operations and provides
 * convenient methods for sending transactions and waiting for transaction confirmation.
 */
class TransactionsModule {
    /**
     * Initializes a new instance of the `Thorest` class.
     * @param thorest - The Thorest instance used to interact with the vechain Thorest blockchain API.
     */
    constructor(readonly thorest: ThorestClient) {}

    /**
     * Sends a signed transaction to the network.
     *
     * @param signedTx - the transaction to send. It must be signed.
     *
     * @returns A promise that resolves to the transaction ID of the sent transaction.
     *
     * @throws an error if the transaction is not signed.
     */
    public async sendTransaction(
        signedTx: Transaction
    ): Promise<SendTransactionResult> {
        assertIsSignedTransaction(signedTx);

        const simulatedTransaction =
            await this.thorest.transactions.simulateTransaction(
                signedTx.body.clauses
            );

        const clausesResults: TransactionSimulationResult[] =
            simulatedTransaction.map((simulation) => {
                return {
                    ...simulation,
                    data: simulation.reverted
                        ? decodeRevertReason(simulation.data)
                        : simulation.data
                };
            });

        const rawTx = `0x${signedTx.encoded.toString('hex')}`;

        const txID = (await this.thorest.transactions.sendTransaction(rawTx))
            .id;

        return {
            id: txID,
            clausesResults
        };
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
        return await Poll.SyncPoll(
            async () =>
                await this.thorest.transactions.getTransactionReceipt(txID),
            {
                requestIntervalInMilliseconds: options?.intervalMs,
                maximumWaitingTimeInMilliseconds: options?.timeoutMs
            }
        ).waitUntil((result) => {
            return result !== null;
        });
    }
}

export { TransactionsModule };
