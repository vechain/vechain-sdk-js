import { type ClauseJSON } from '../../json';
import { ClauseData } from '@thor/thorest';
import { Address, BlockRef, UInt } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';
import { type ExecuteCodesRequestJSON } from '../json';

/**
 * Full-Qualified Path
 */
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
     * Constructs a new instance of the class by parsing the provided JSON object.
     *
     * @param {ExecuteCodesRequestJSON} json - The JSON object containing execute codes request data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
    constructor(json: ExecuteCodesRequestJSON) {
        try {
            this.provedWork = json.provedWork ?? null;
            this.gasPayer =
                typeof json.gasPayer === 'string'
                    ? Address.of(json.gasPayer)
                    : null;
            this.expiration =
                typeof json.expiration === 'number'
                    ? UInt.of(json.expiration).valueOf()
                    : null;
            this.blockRef =
                typeof json.blockRef === 'string'
                    ? BlockRef.of(json.blockRef)
                    : null;
            this.clauses =
                json.clauses != null
                    ? json.clauses.map(
                          (clauseJSON: ClauseJSON): ClauseData =>
                              ClauseData.of(clauseJSON)
                      )
                    : null;
            this.gas = typeof json.gas === 'number' ? BigInt(json.gas) : null;
            this.gasPrice =
                typeof json.gasPrice === 'string'
                    ? BigInt(json.gasPrice)
                    : null;
            this.caller =
                typeof json.caller === 'string'
                    ? Address.of(json.caller)
                    : null;
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
