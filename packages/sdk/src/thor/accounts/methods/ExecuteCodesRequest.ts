import { Clause, type ClauseJSON } from '@thor';
import {
    Address,
    BlockRef,
    IllegalArgumentError,
    UInt
} from '@vechain/sdk-core';
import { ExecuteCodesRequestJSON } from '../response/ExecuteCodesRequestJSON';
/**
 * Full-Qualified Path
 */
const FQP = 'packages/core/src/thor/accounts/ExecuteCodesRequest.ts!';

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
    readonly expiration: UInt | null;

    /**
     * The block reference of the request.
     */
    readonly blockRef: BlockRef | null;

    /**
     * The clauses of the request.
     */
    readonly clauses: Clause[] | null;

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
     * Constructs a new instance of the class by parsing the provided JSON object.
     *
     * @param {ExecuteCodesRequestJSON} json - The JSON object containing execute codes request data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
    constructor(json: ExecuteCodesRequestJSON) {
        try {
            this.provedWork = json.provedWork ? json.provedWork : null;
            this.gasPayer = json.gasPayer ? Address.of(json.gasPayer) : null;
            this.expiration = json.expiration ? UInt.of(json.expiration) : null;
            this.blockRef = json.blockRef ? BlockRef.of(json.blockRef) : null;
            this.clauses = json.clauses
                ? json.clauses.map(
                      (clauseJSON: ClauseJSON): Clause => new Clause(clauseJSON)
                  )
                : null;
            this.gas = json.gas ? BigInt(json.gas) : null;
            this.gasPrice = json.gasPrice ? BigInt(json.gasPrice) : null;
            this.caller = json.caller ? Address.of(json.caller) : null;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: ExecuteCodesRequestJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current execute codes request data into a JSON representation.
     *
     * @returns {ExecuteCodesRequestJSON} A JSON object containing the execute codes request data.
     */
    toJSON(): ExecuteCodesRequestJSON {
        return {
            provedWork: this.provedWork || undefined,
            gasPayer: this.gasPayer?.toString(),
            expiration: this.expiration?.valueOf(),
            blockRef: this.blockRef?.toString(),
            clauses: this.clauses?.map((clause: Clause) => clause.toJSON()),
            gas: this.gas ? Number(this.gas) : undefined,
            gasPrice: this.gasPrice ? this.gasPrice.toString() : undefined,
            caller: this.caller?.toString()
        } satisfies ExecuteCodesRequestJSON;
    }
}

export { ExecuteCodesRequest };
