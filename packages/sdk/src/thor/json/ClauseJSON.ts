/**
 * [Clause](http://localhost:8669/doc/stoplight-ui/#/schemas/Clause)
 */
interface ClauseJSON {
    /**
     * The recipient of the clause. Null indicates contract deployment.
     */
    to: string | null; // hex address

    /**
     * The hexadecimal representation of the amount (wei) of VET to be transferred.
     *
     * Thor expresses the amount as a hexadecimal {@link Quantity} expression,
     * aligned to nibble (4 bits); for example, zero is expressed as `0x0`.
     *
     */
    value: string; // hex ^0x[0-9a-f]*$

    /**
     * The input data for the clause (in bytes).
     */
    data?: string; // hex ^0x[0-9a-f]*$
}

export { type ClauseJSON };
