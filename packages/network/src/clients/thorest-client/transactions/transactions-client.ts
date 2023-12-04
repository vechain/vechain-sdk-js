import { type HttpClient, buildQuery, thorest } from '../../../utils';
import {
    dataUtils,
    revisionUtils,
    type TransactionClause,
    TransactionHandler,
    assertValidTransactionID,
    assertValidTransactionHead
} from '@vechainfoundation/vechain-sdk-core';
import {
    type SimulateTransactionClause,
    type GetTransactionInputOptions,
    type GetTransactionReceiptInputOptions,
    type TransactionDetail,
    type TransactionReceipt,
    type TransactionSendResult,
    type SimulateTransactionOptions,
    type TransactionSimulationResult
} from './types';
import {
    assert,
    buildError,
    DATA
} from '@vechainfoundation/vechain-sdk-errors';
import type { Clause } from '../blocks';

/**
 * Client for reading and creating transactions
 */
class TransactionsClient {
    /**
     * Initializes a new instance of the `TransactionClient` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(protected readonly httpClient: HttpClient) {}

    /**
     * Retrieves the details of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to the details of the transaction.
     */
    public async getTransaction(
        id: string,
        options?: GetTransactionInputOptions
    ): Promise<TransactionDetail | null> {
        // Invalid transaction ID
        assertValidTransactionID(id);

        // Invalid head
        assertValidTransactionHead(options?.head);

        return (await this.httpClient.http(
            'GET',
            thorest.transactions.get.TRANSACTION(id),
            {
                query: buildQuery({
                    raw: options?.raw,
                    head: options?.head,
                    options: options?.pending
                })
            }
        )) as TransactionDetail | null;
    }

    /**
     * Retrieves the receipt of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param options - (Optional) Other optional parameters for the request.
     *                  If `head` is not specified, the receipt of the transaction at the best block is returned.
     * @returns A promise that resolves to the receipt of the transaction.
     */
    public async getTransactionReceipt(
        id: string,
        options?: GetTransactionReceiptInputOptions
    ): Promise<TransactionReceipt | null> {
        // Invalid transaction ID
        assertValidTransactionID(id);

        // Invalid head
        assertValidTransactionHead(options?.head);

        return (await this.httpClient.http(
            'GET',
            thorest.transactions.get.TRANSACTION_RECEIPT(id),
            {
                query: buildQuery({ head: options?.head })
            }
        )) as TransactionReceipt | null;
    }

    /**
     * Retrieves the receipt of a transaction.
     *
     * @param raw - The raw transaction.
     * @returns The transaction id of send transaction.
     */
    public async sendTransaction(raw: string): Promise<TransactionSendResult> {
        // Validate raw transaction
        assert(
            dataUtils.isHexString(raw),
            DATA.INVALID_DATA_TYPE,
            'Sending failed: Input must be a valid raw transaction in hex format.',
            { raw }
        );

        // Decode raw transaction to check if raw is ok
        try {
            TransactionHandler.decode(Buffer.from(raw.slice(2), 'hex'), true);
        } catch (error) {
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Sending failed: Input must be a valid raw transaction in hex format. Decoding error encountered.',

                { raw },
                error
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
     * Simulates the execution of a transaction.
     * Allows to estimate the gas cost of a transaction without sending it, as well as to retrieve the return value(s) of the transaction.
     *
     * @param clauses - The clauses of the transaction to simulate.
     * @param options - (Optional) The options for simulating the transaction.
     *
     * @returns A promise that resolves to an array of simulation results.
     *          Each element of the array represents the result of simulating a clause.
     */
    public async simulateTransaction(
        clauses: SimulateTransactionClause[],
        options?: SimulateTransactionOptions
    ): Promise<TransactionSimulationResult[]> {
        const {
            revision,
            caller,
            gasPrice,
            gasPayer,
            gas,
            blockRef,
            expiration,
            provedWork
        } = options ?? {};

        assert(
            revision === undefined ||
                revision === null ||
                revisionUtils.isRevisionAccount(revision),
            DATA.INVALID_DATA_TYPE,
            'Invalid revision given as input. Input must be a valid revision (i.e., a block number or block ID).',
            { revision }
        );

        return (await this.httpClient.http(
            'POST',
            thorest.accounts.post.SIMULATE_TRANSACTION(revision),
            {
                query: buildQuery({ revision }),
                body: {
                    clauses: this.convertClausesValuesToHexStrings(clauses),
                    gas,
                    gasPrice,
                    caller,
                    provedWork,
                    gasPayer,
                    expiration,
                    blockRef
                }
            }
        )) as TransactionSimulationResult[];
    }

    private convertClausesValuesToHexStrings(
        clauses: TransactionClause[]
    ): Clause[] {
        return clauses.map((clause) => {
            if (typeof clause.value === 'number') {
                return {
                    ...clause,
                    value: '0x' + clause.value.toString(16)
                };
            }
            return {
                ...clause
            };
        });
    }
}

export { TransactionsClient };
