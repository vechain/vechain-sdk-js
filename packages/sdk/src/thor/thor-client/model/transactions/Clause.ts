import { type Address, type Hex } from '@common/vcdm';
import { type ClauseData } from '@thor/thorest';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/thor-client/model/transactions/Clause.ts!';

/**
 * Clause for a transaction.
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
        data: Hex | null,
        comment: string | null,
        abi: string | null
    ) {
        this.to = to;
        this.value = value;
        this.data = data ?? null;
        this.comment = comment ?? null;
        this.abi = abi ?? null;
    }

    /**
     * Creates a new Clause instance from the given ClauseJSON object.
     *
     * @param {ClauseJSON} json - The JSON object containing the input data to construct a Clause.
     *                             The `to` property represents the target address and is processed as an Address instance.
     *                             The `value` property is expected to be a hexadecimal value, parsed as a BigInt.
     *                             The `data` property is optional and, if present, is parsed as a HexUInt instance.
     * @return {Clause} A new Clause instance created using the data extracted from the provided ClauseJSON object.
     * @throws {IllegalArgumentError} If the provided JSON object contains invalid data or couldn't be properly parsed.
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
}

export { Clause };
