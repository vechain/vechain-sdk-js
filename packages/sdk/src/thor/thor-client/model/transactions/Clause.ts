import { type Address, Hex, Quantity } from '@common/vcdm';
import { type ClauseJSON } from '@thor/thorest/json';
import { type ClauseData } from '@thor/thorest/common';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/thorest/model/Clause.ts!';

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
     *
     * Not serialized in {@link ClauseJSON}.
     */
    readonly comment: string | null;

    /**
     * Optional ABI for the contract method invocation.
     *
     * Not serialized in {@link ClauseJSON}.
     */
    readonly abi: string | null;

    /**
     * Constructs an instance representing a transaction or an interaction.
     *
     * @param {Address | null} to - The target address of the transaction. Can be null if not specified.
     * @param {bigint} value - The amount of value associated with the transaction, defined as a bigint.
     * @param {Hex | null} [data] - Optional hexadecimal data payload. Defaults to null if not provided.
     * @param {string | null} [comment] - Optional comment or note associated with the transaction. Defaults to null if not provided.
     * @param {string | null} [abi] - Optional ABI (Application Binary Interface) string defining the structure of the interaction. Defaults to null if not provided.
     * @return {void} Does not return anything.
     */
    constructor(
        to: Address | null,
        value: bigint,
        data?: Hex | null,
        comment?: string | null,
        abi?: string | null
    ) {
        this.to = to;
        this.value = value;
        this.data = data ?? null;
        this.comment = comment ?? null;
        this.abi = abi ?? null;
    }

    /**
     * Creates a new Clause instance from the given ClauseData object.
     *
     * @param {ClauseData} clauseData - The ClauseData object containing the input data to construct a Clause.
     * @return {Clause} A new Clause instance created using the data extracted from the provided ClauseJSON object.
     */
    public static of(clauseData: ClauseData): Clause {
        return new Clause(
            clauseData.to,
            clauseData.value,
            clauseData.data,
            null,
            null
        );
    }

    /**
     * Converts the current instance of the class into a ClauseJSON representation.
     * No input data is expressed as `0x`.
     * @return {ClauseJSON} The JSON object representing the current instance.
     */
    toJSON(): ClauseJSON {
        return {
            to: this.to !== null ? this.to.toString() : null,
            value: Quantity.of(this.value).toString(),
            data: this.data !== null ? this.data.toString() : Hex.PREFIX
        } satisfies ClauseJSON;
    }
}

export { Clause };
