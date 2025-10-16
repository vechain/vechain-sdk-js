import { ClauseData } from '@thor/thorest';
import { type Address, type BlockRef } from '@common/vcdm';
import { type ExecuteCodesRequestJSON } from '../json';
import {
    type Clause,
    type SimulateTransactionOptions
} from '@thor/thor-client/model/transactions';
import { IllegalArgumentError } from '@common';

const FQP =
    'packages/sdk/src/thor/thorest/accounts/methods/ExecuteCodesRequest.ts!';

/**
 * Execute Codes Request
 *
 * Represents a request for executing codes.
 *
 * [ExecuteCodesRequest](http://localhost:8669/doc/stoplight-ui/#/schemas/ExecuteCodesRequest)
 */
class ExecuteCodesRequest {
    /**
     * The proved work of the request.
     */
    readonly provedWork: string | null;

    /**
     * The gas payer of the request.
     */
    readonly gasPayer: Address | null;

    /**
     * The expiration of the request.
     */
    readonly expiration: number | null;

    /**
     * The block reference of the request.
     */
    readonly blockRef: BlockRef | null;

    /**
     * The clauses of the request.
     */
    readonly clauses: ClauseData[] | null;

    /**
     * The gas of the request.
     */
    readonly gas: bigint | null;

    /**
     * The gas price of the request.
     */
    readonly gasPrice: bigint | null;

    /**
     * The caller of the request.
     */
    readonly caller: Address | null;

    /**
     * Constructs a new instance of the class from the given clauses and options.
     *
     * @param {Clause[]} clauses - The clauses to execute.
     * @param {SimulateTransactionOptions} options - The options for the request.
     */
    constructor(clauses: Clause[], options?: SimulateTransactionOptions) {
        if (clauses.length === 0) {
            throw new IllegalArgumentError(
                `${FQP}<ExecuteCodesRequest>.constructor()`,
                'clauses must not be empty'
            );
        }
        this.provedWork = options?.provedWork ?? null;
        this.gasPayer = options?.gasPayer ?? null;
        this.expiration = options?.expiration ?? null;
        this.blockRef = options?.blockRef ?? null;
        this.clauses = clauses.map(
            (clause: Clause) =>
                new ClauseData(clause.to, clause.value, clause.data)
        );
        this.gas = options?.gas ?? null;
        this.gasPrice = options?.gasPrice ?? null;
        this.caller = options?.caller ?? null;
    }

    /**
     * Converts the current execute codes request data into a JSON representation.
     *
     * @returns {ExecuteCodesRequestJSON} A JSON object containing the execute codes request data.
     */
    toJSON(): ExecuteCodesRequestJSON {
        return {
            provedWork: this.provedWork ?? undefined,
            gasPayer: this.gasPayer?.toString(),
            expiration: this.expiration?.valueOf(),
            blockRef: this.blockRef?.toString(),
            clauses: this.clauses?.map((clause: ClauseData) => clause.toJSON()),
            gas: this.gas !== null ? Number(this.gas) : undefined,
            gasPrice: this.gasPrice?.toString(),
            caller: this.caller?.toString()
        } satisfies ExecuteCodesRequestJSON;
    }
}

export { ExecuteCodesRequest };
