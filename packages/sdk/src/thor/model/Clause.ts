import { Address, Hex, HexUInt, Quantity } from '@vcdm';
import { type ClauseJSON } from '@/json';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/model/Clause.ts!';

/**
 * [Clause](http://localhost:8669/doc/stoplight-ui/#/schemas/Clause)
 */

class Clause {
    /**
     * The recipient of the clause. Null indicates contract deployment.
     */
    readonly to: Address | null;

    /**
     * The amount (wei) of VET to be transferred.
     */
    readonly value: bigint;

    /**
     * The input data for the clause (in bytes).
     */
    readonly data: Hex | null;

    /**
     * Optional comment for the clause, helpful for displaying what the clause is doing.
     */
    readonly comment: string | null;

    /**
     * Optional ABI for the contract method invocation.
     */
    readonly abi: string | null;

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {ClauseJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} If the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: ClauseJSON) {
        try {
            this.to = json.to !== null ? Address.of(json.to) : null;
            this.value = HexUInt.of(json.value).bi;
            this.data = json.data === undefined ? null : HexUInt.of(json.data);
            this.comment = json.comment ?? null;
            this.abi = json.abi ?? null;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: ClauseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into a ClauseJSON representation.
     *
     * No input data is expressed as `0x`.
     *
     * @return {ClauseJSON} The JSON object representing the current instance.
     */
    toJSON(): ClauseJSON {
        return {
            to: this.to !== null ? this.to.toString() : null,
            value: Quantity.of(this.value).toString(),
            data: this.data !== null ? this.data.toString() : Hex.PREFIX,
            comment: this.comment ?? undefined,
            abi: this.abi ?? undefined
        } satisfies ClauseJSON;
    }
}

export { Clause };
