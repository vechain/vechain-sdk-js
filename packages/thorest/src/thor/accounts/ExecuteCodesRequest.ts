import { Clause, type ClauseJSON } from '@thor';
import {
    Address,
    BlockRef,
    IllegalArgumentError,
    UInt
} from '@vechain/sdk-core';
import { ExecuteCodesRequestJSON } from './ExecuteCodesRequestJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/accounts/ExecuteCodesRequest.ts!';

/**
 * Execute Codes Request
 *
 * Represents a request for executing codes.
 */
class ExecuteCodesRequest {
    /**
     * The proved work of the request.
     */
    readonly provedWork?: string;

    /**
     * The gas payer of the request.
     */
    readonly gasPayer?: Address;

    /**
     * The expiration of the request.
     */
    readonly expiration?: UInt;

    /**
     * The block reference of the request.
     */
    readonly blockRef?: BlockRef;

    /**
     * The clauses of the request.
     */
    readonly clauses?: Clause[];

    /**
     * The gas of the request.
     */
    readonly gas?: bigint;

    /**
     * The gas price of the request.
     */
    readonly gasPrice?: bigint;

    /**
     * The caller of the request.
     */
    readonly caller?: Address;

    /**
     * Constructs a new instance of the class by parsing the provided JSON object.
     *
     * @param {ExecuteCodesRequestJSON} json - The JSON object containing execute codes request data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
    constructor(json: ExecuteCodesRequestJSON) {
        try {
            this.provedWork = json.provedWork;
            this.gasPayer =
                json.gasPayer === undefined
                    ? undefined
                    : Address.of(json.gasPayer);
            this.expiration =
                json.expiration === undefined
                    ? undefined
                    : UInt.of(json.expiration);
            this.blockRef =
                json.blockRef === undefined
                    ? undefined
                    : BlockRef.of(json.blockRef);
            this.clauses =
                json.clauses === undefined
                    ? undefined
                    : json.clauses.map(
                          (clauseJSON: ClauseJSON): Clause =>
                              new Clause(clauseJSON)
                      );
            this.gas = json.gas === undefined ? undefined : BigInt(json.gas);
            this.gasPrice = json.gasPrice === undefined ? undefined : BigInt(json.gasPrice);
            this.caller =
                json.caller === undefined ? undefined : Address.of(json.caller);
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
            provedWork: this.provedWork,
            gasPayer: this.gasPayer?.toString(),
            expiration: this.expiration?.valueOf(),
            blockRef: this.blockRef?.toString(),
            clauses: this.clauses?.map((clause: Clause) => clause.toJSON()),
            gas: this.gas === undefined ? undefined : Number(this.gas),
            gasPrice: this.gasPrice === undefined ? undefined : this.gasPrice.toString(),
            caller: this.caller?.toString()
        } satisfies ExecuteCodesRequestJSON;
    }
}

export { ExecuteCodesRequest };
