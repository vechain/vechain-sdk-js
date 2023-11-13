import { type HttpClient } from '../../http';
import { buildQuery, thorest } from '../../../utils';
import {
    dataUtils,
    transactionDataUtils,
    TransactionHandler
} from '@vechain-sdk/core';
import {
    type TransactionDetail,
    type TransactionReceipt,
    type TransactionSendResult
} from './types';
import { buildError, DATA } from '@vechain-sdk/errors';

class TransactionClient {
    /**
     * Initializes a new instance of the `TransactionClient` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(protected readonly httpClient: HttpClient) {}

    /**
     * Retrieves the details of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param raw - (Optional) If true, returns the raw transaction data instead of the parsed transaction object.
     * @param head - (Optional) The block number or ID to reference the transaction.
     * @param pending - (Optional) If true, returns the pending transaction details instead of the final transaction details.
     */
    public async getTransaction(
        id: string,
        raw?: boolean,
        head?: string,
        pending?: boolean
    ): Promise<TransactionDetail> {
        // Invalid transaction ID
        if (!transactionDataUtils.isTransactionId(id, true))
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid transaction ID given as input. Input must be an hex string of length 64.'
            );

        // Invalid head
        if (
            head !== undefined &&
            !transactionDataUtils.isTransactionHead(head, true)
        )
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid head given as input. Input must be an hex string of length 64.'
            );

        return (await this.httpClient.http(
            'GET',
            thorest.transactions.get.TRANSACTION(id),
            {
                query: buildQuery({ raw, head, pending })
            }
        )) as TransactionDetail;
    }

    /**
     * Retrieves the receipt of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param head - (Optional) The block number or ID to reference the transaction.
     */
    public async getTransactionReceipt(
        id: string,
        head?: string
    ): Promise<TransactionReceipt> {
        // Invalid transaction ID
        if (!transactionDataUtils.isTransactionId(id, true))
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid transaction ID given as input. Input must be an hex string of length 64.'
            );

        // Invalid head
        if (
            head !== undefined &&
            !transactionDataUtils.isTransactionHead(head, true)
        )
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid head given as input. Input must be an hex string of length 64.'
            );

        return (await this.httpClient.http(
            'GET',
            thorest.transactions.get.TRANSACTION_RECEIPT(id),
            {
                query: buildQuery({ head })
            }
        )) as TransactionReceipt;
    }

    /**
     * Retrieves the receipt of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param head - (Optional) The block number or ID to reference the transaction.
     */
    public async sendTransaction(raw: string): Promise<TransactionSendResult> {
        // Validate raw transaction
        if (!dataUtils.isHexString(raw))
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid raw transaction given as input. Input must be an hex string'
            );

        // Decode raw transaction to check if raw is ok
        try {
            TransactionHandler.decode(Buffer.from(raw.slice(2), 'hex'), true);
        } catch (error) {
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid raw transaction given as input. Input must be a valid raw transaction. Error occurs while decoding the transaction.'
            );
        }

        return (await this.httpClient.http(
            'POST',
            thorest.transactions.post.TRANSACTION(),
            {
                body: { raw }
            }
        )) as TransactionSendResult;
    }

    /**
     * Simulates a transaction call and returns the result.
     *
     * @param revision - The block number or ID to reference the state of the account.
     * @param clauses - The clauses to simulate.
     * @param gas - The gas limit for the transaction.
     * @param gasPrice - The gas price for the transaction.
     * @param caller - The caller address.
     * @param provedWork - The proved work.
     * @param gasPayer - The gas payer address.
     * @param expiration - The expiration of transaction.
     * @param blockRef - The block reference.
     * @returns A promise that resolves to the result of the simulated transaction.
     *
     * @NOTE: Define better parameters and gas estimation
     */
    // public async simulateTransactionCall(
    //     revision: string,
    //     clauses: TransactionClause[],
    //     gas: string | number,
    //     gasPrice: string | number,
    //     caller: string,
    //     provedWork: string | number,
    //     gasPayer: string,
    //     expiration: number,
    //     blockRef: string
    // ): Promise<TransactionCallSimulation> {
    //     return (await this.httpClient.http(
    //         'POST',
    //         thorest.accounts.post.ACCOUNT(revision),
    //         {
    //             body: {
    //                 clauses,
    //                 gas,
    //                 gasPrice,
    //                 caller,
    //                 provedWork,
    //                 gasPayer,
    //                 expiration,
    //                 blockRef
    //             }
    //         }
    //     )) as TransactionCallSimulation;
    // }
}

export { TransactionClient };
