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
import { Revision, type Hex } from '@common/vcdm';
import {
    type ExecuteCodeResponse,
    ExecuteCodesRequest,
    InspectClauses,
    RetrieveRawTransactionByID,
    RetrieveTransactionByID,
    RetrieveTransactionReceipt
} from '@thor/thorest';
import { waitUntil, type WaitUntilOptions } from '@common/utils';

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
        options: GetTransactionOptions
    ): Promise<Transaction | null> {
        const request = RetrieveTransactionByID.of(id)
            .withPending(options.pending)
            .withHead(options.head);
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
     * Waits for the transaction receipt to exist
     * @param transactionId - Id of the transaction to wait for its receipt
     * @param options - Timeout and polling options
     * @returns The transaction receipt or null if still not available
     */
    public async waitForTransactionReceipt(
        transactionId: Hex,
        options?: WaitForTransactionReceiptOptions
    ): Promise<TransactionReceipt | null> {
        // setup for polling
        const getReceiptTask = async (): Promise<TransactionReceipt | null> => {
            return this.getTransactionReceipt(transactionId);
        };
        const checkReceipt = (receipt: TransactionReceipt | null): boolean => {
            return receipt !== null;
        };
        const waitOptions: WaitUntilOptions<TransactionReceipt | null> = {
            task: getReceiptTask,
            predicate: checkReceipt,
            intervalMs: options?.intervalMs ?? 1000,
            timeoutMs: options?.timeoutMs ?? 30000
        };
        return await waitUntil(waitOptions);
    }
}

export { TransactionsModule };
