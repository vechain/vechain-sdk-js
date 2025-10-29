import {
    type GetTransactionOptions,
    Transaction,
    RawTransaction,
    type Clause,
    type SimulateTransactionOptions,
    ClauseSimulationResult,
    type GetTransactionReceiptOptions,
    TransactionReceipt,
    type WaitForTransactionReceiptOptions
} from '@thor/thor-client/model/transactions';
import { AbstractThorModule } from '../AbstractThorModule';
import { Hex, Revision } from '@common/vcdm';
import {
    type ExecuteCodeResponse,
    ExecuteCodesRequest,
    InspectClauses,
    RetrieveRawTransactionByID,
    RetrieveTransactionByID,
    RetrieveTransactionReceipt,
    SendTransaction
} from '@thor/thorest';
import { TransactionRequestRLPCodec } from '../rlp/TransactionRequestRLPCodec';
import { type TransactionRequest } from '@thor/thor-client/model/transactions/TransactionRequest';
import { IllegalArgumentError, TimeoutError } from '@common/errors';
import { waitUntil, type WaitUntilOptions } from '@common/utils/poller';

class TransactionsModule extends AbstractThorModule {
    /**
     * Retrieves a transaction by its ID.
     * @param id - The ID of the transaction to get.
     * @param pending - Whether to include pending transaction.
     * @param head - Define the ID of the head block. Best block is assumed if omitted..
     * @returns The transaction or null if it is not found.
     */
    public async getTransaction(
        id: Hex,
        options?: GetTransactionOptions
    ): Promise<Transaction | null> {
        const request = RetrieveTransactionByID.of(id)
            .withPending(options?.pending)
            .withHead(options?.head);
        const thorResponse = await request.askTo(this.httpClient);
        return thorResponse.response !== null
            ? new Transaction(thorResponse.response)
            : null;
    }

    /**
     * Retrieves a raw transaction by its ID.
     * @param id - The ID of the transaction to get.
     * @param pending - Whether to include pending transaction.
     * @param head - Define the ID of the head block. Best block is assumed if omitted..
     * @returns The raw transaction or null if it is not found.
     */
    public async getRawTransaction(
        id: Hex,
        options: GetTransactionOptions
    ): Promise<RawTransaction | null> {
        const request = RetrieveRawTransactionByID.of(id)
            .withPending(options.pending)
            .withHead(options.head);
        const thorResponse = await request.askTo(this.httpClient);
        return thorResponse.response !== null
            ? RawTransaction.of(thorResponse.response)
            : null;
    }

    /**
     * Simulates the execution of a transaction.
     * Simulation allows to:
     * - Estimate the gas cost of a transaction without sending it
     * - Call read-only contract functions
     * - Read simulated events and transfers
     * - Check if the transaction will be successful
     *
     * @param clauses - The clauses of the transaction to simulate.
     * @param options - (Optional) The options for simulating the transaction.
     * @returns A promise that resolves to an array of simulation results.
     *          Each element of the array represents the result of simulating a clause.
     * @throws {ThorError}
     */
    public async simulateTransaction(
        clauses: Clause[],
        options?: SimulateTransactionOptions
    ): Promise<ClauseSimulationResult[]> {
        const request = new ExecuteCodesRequest(clauses, options);
        const query = InspectClauses.of(request).withRevision(
            options?.revision ?? Revision.BEST
        );
        const thorResponse = await query.askTo(this.httpClient);
        return thorResponse.response.items.map(
            (resp: ExecuteCodeResponse) => new ClauseSimulationResult(resp)
        );
    }

    /**
     * Retrieves a transaction receipt by its ID.
     * @param id - The ID of the transaction to get the receipt for.
     * @param options - (Optional) The options for retrieving the transaction receipt.
     * @returns The transaction receipt or null if it is not found.
     */
    public async getTransactionReceipt(
        id: Hex,
        options?: GetTransactionReceiptOptions
    ): Promise<TransactionReceipt | null> {
        const request = RetrieveTransactionReceipt.of(id).withHead(
            options?.head
        );
        const thorResponse = await request.askTo(this.httpClient);
        return thorResponse.response !== null
            ? TransactionReceipt.of(thorResponse.response)
            : null;
    }

    /**
     * Submits a raw signed, RLP encoded transaction to the thor network.
     * @param rawTx - The raw encoded transaction to send.
     * @returns The transaction ID.
     */
    public async sendRawTransaction(rawTx: Hex): Promise<Hex> {
        // Decode the raw transaction to check if it is valid
        TransactionRequestRLPCodec.decode(rawTx.bytes);
        // Send the transaction to the network
        const method = SendTransaction.of(rawTx.bytes);
        const thorResponse = await method.askTo(this.httpClient);
        const txId = thorResponse.response.id;
        return txId;
    }

    /**
     * Sends a signed transaction request to the thor network.
     * @param txRequest Signed transaction request to send.
     * @returns The transaction ID.
     */
    public async sendTransaction(txRequest: TransactionRequest): Promise<Hex> {
        // encode the transaction request
        const encoded = TransactionRequestRLPCodec.encode(txRequest);
        const encodedHex = Hex.of(encoded);
        // send the transaction to the network
        return await this.sendRawTransaction(encodedHex);
    }

    /**
     * Waits for the transaction receipt to exist
     * @param transactionId - Id of the transaction to wait for its receipt
     * @param options - Timeout and polling options
     * @returns The transaction receipt or null if still not available
     * @throws {IllegalArgumentError} If the intervalMs or timeoutMs are invalid
     * @throws {TimeoutError} If the transaction receipt is not found within the timeout period
     */
    public async waitForTransactionReceipt(
        transactionId: Hex,
        options?: WaitForTransactionReceiptOptions
    ): Promise<TransactionReceipt | null> {
        // check options
        if (options?.intervalMs !== undefined && options?.intervalMs <= 0) {
            throw new IllegalArgumentError(
                'waitForTransactionReceipt(options.intervalMs)',
                'intervalMs must be greater than zero',
                { intervalMs: options.intervalMs }
            );
        }
        if (options?.timeoutMs !== undefined && options?.timeoutMs <= 0) {
            throw new IllegalArgumentError(
                'waitForTransactionReceipt(options.timeoutMs)',
                'timeoutMs must be greater than zero',
                { timeoutMs: options.timeoutMs }
            );
        }
        if (
            options?.timeoutMs !== undefined &&
            options?.intervalMs !== undefined &&
            options?.timeoutMs < options?.intervalMs
        ) {
            throw new IllegalArgumentError(
                'waitForTransactionReceipt(options.timeoutMs, options.intervalMs)',
                'timeoutMs must be greater than or equal to intervalMs',
                { timeoutMs: options.timeoutMs, intervalMs: options.intervalMs }
            );
        }
        // setup for polling
        const waitOptions: WaitUntilOptions<TransactionReceipt | null> = {
            task: async () => this.getTransactionReceipt(transactionId),
            predicate: (receipt: TransactionReceipt | null): boolean => {
                return receipt !== null;
            },
            intervalMs: options?.intervalMs ?? 1000,
            timeoutMs: options?.timeoutMs ?? 30000
        };
        try {
            return await waitUntil(waitOptions);
        } catch (error) {
            if (error instanceof TimeoutError) {
                throw new TimeoutError(
                    'waitForTransactionReceipt(transactionId, options)',
                    'Transaction receipt not found within the timeout period'
                );
            }
            throw error;
        }
    }
}

export { TransactionsModule };
