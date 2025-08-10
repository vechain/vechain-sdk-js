/**
 * [Clause](http://localhost:8669/doc/stoplight-ui/#/schemas/Clause)
 */
interface ClauseJSON {
    /**
     * The address that sent the VET.
     */
    to: string | null; // hex address

    /**
     * The amount (wei) of VET to be transferred.
     *
     * Thor expresses the amount as a hexadecimal {@link Quantity} expression,
     * aligned to nibble (4 bits); for example, zero is expressed as `0x0`.
     *
     * Creating a {@link TransactionRequest}, is convenient to express the
     * value as a `bigint` type.
     */
    value: bigint | string;

    /**
     * The input data for the clause (in bytes).
     */
    data?: string; // hex
}

export { type ClauseJSON };
