import {
    type GetTransactionOptions,
    Transaction,
    RawTransaction,
    type Clause,
    type SimulateTransactionOptions,
    ClauseSimulationResult
} from '@thor/thor-client/model/transactions';
import { AbstractThorModule } from '../AbstractThorModule';
import { Revision, type Hex } from '@common/vcdm';
import {
    type ExecuteCodeResponse,
    ExecuteCodesRequest,
    InspectClauses,
    RetrieveRawTransactionByID,
    RetrieveTransactionByID
} from '@thor/thorest';

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
     * @throws {InvalidDataType}
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
}

export { TransactionsModule };
